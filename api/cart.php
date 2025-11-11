<?php
/**
 * Cart API Handler
 * Handles all cart operations: add, update, remove, get cart
 */

require_once '../php/config.php';

header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        case 'get':
            getCart();
            break;
        case 'add':
            addToCart();
            break;
        case 'update':
            updateCartItem();
            break;
        case 'remove':
            removeFromCart();
            break;
        case 'clear':
            clearCart();
            break;
        case 'count':
            getCartCount();
            break;
        default:
            jsonResponse(['success' => false, 'message' => 'Invalid action'], 400);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => $e->getMessage()], 500);
}

/**
 * Get all cart items
 */
function getCart() {
    global $pdo;
    
    $userId = getCurrentUserId();
    $sessionId = getSessionId();
    
    $sql = "SELECT ci.cart_id, ci.item_id, ci.quantity, ci.special_instructions,
                   mi.item_name, mi.description, mi.price, mi.image_url,
                   (ci.quantity * mi.price) as item_total
            FROM cart_items ci
            JOIN menu_items mi ON ci.item_id = mi.item_id
            WHERE ";
    
    if ($userId) {
        $sql .= "ci.user_id = :user_id";
        $params = ['user_id' => $userId];
    } else {
        $sql .= "ci.session_id = :session_id";
        $params = ['session_id' => $sessionId];
    }
    
    $sql .= " AND mi.is_available = TRUE ORDER BY ci.added_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $items = $stmt->fetchAll();
    
    // Calculate totals
    $subtotal = 0;
    foreach ($items as $item) {
        $subtotal += $item['item_total'];
    }
    
    $totals = calculateCartTotals($subtotal);
    
    jsonResponse([
        'success' => true,
        'items' => $items,
        'count' => count($items),
        'subtotal' => $subtotal,
        'totals' => $totals
    ]);
}

/**
 * Add item to cart
 */
function addToCart() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['item_id']) || !isset($data['quantity'])) {
        jsonResponse(['success' => false, 'message' => 'Missing required fields'], 400);
    }
    
    $itemId = (int)$data['item_id'];
    $quantity = (int)$data['quantity'];
    $specialInstructions = isset($data['special_instructions']) ? sanitize($data['special_instructions']) : null;
    
    if ($quantity < 1) {
        jsonResponse(['success' => false, 'message' => 'Quantity must be at least 1'], 400);
    }
    
    // Check if item exists and is available
    $stmt = $pdo->prepare("SELECT item_id, item_name FROM menu_items WHERE item_id = ? AND is_available = TRUE");
    $stmt->execute([$itemId]);
    $item = $stmt->fetch();
    
    if (!$item) {
        jsonResponse(['success' => false, 'message' => 'Item not found or not available'], 404);
    }
    
    $userId = getCurrentUserId();
    $sessionId = getSessionId();
    
    // Check if item already in cart
    if ($userId) {
        $stmt = $pdo->prepare("SELECT cart_id, quantity FROM cart_items WHERE user_id = ? AND item_id = ?");
        $stmt->execute([$userId, $itemId]);
    } else {
        $stmt = $pdo->prepare("SELECT cart_id, quantity FROM cart_items WHERE session_id = ? AND item_id = ?");
        $stmt->execute([$sessionId, $itemId]);
    }
    
    $existingItem = $stmt->fetch();
    
    if ($existingItem) {
        // Update quantity
        $newQuantity = $existingItem['quantity'] + $quantity;
        $stmt = $pdo->prepare("UPDATE cart_items SET quantity = ?, special_instructions = ?, updated_at = NOW() WHERE cart_id = ?");
        $stmt->execute([$newQuantity, $specialInstructions, $existingItem['cart_id']]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Đã cập nhật số lượng trong giỏ hàng',
            'action' => 'updated'
        ]);
    } else {
        // Insert new item
        if ($userId) {
            $stmt = $pdo->prepare("INSERT INTO cart_items (user_id, item_id, quantity, special_instructions) VALUES (?, ?, ?, ?)");
            $stmt->execute([$userId, $itemId, $quantity, $specialInstructions]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO cart_items (session_id, item_id, quantity, special_instructions) VALUES (?, ?, ?, ?)");
            $stmt->execute([$sessionId, $itemId, $quantity, $specialInstructions]);
        }
        
        jsonResponse([
            'success' => true,
            'message' => 'Đã thêm vào giỏ hàng',
            'action' => 'added'
        ]);
    }
}

/**
 * Update cart item quantity
 */
function updateCartItem() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['cart_id']) || !isset($data['quantity'])) {
        jsonResponse(['success' => false, 'message' => 'Missing required fields'], 400);
    }
    
    $cartId = (int)$data['cart_id'];
    $quantity = (int)$data['quantity'];
    
    if ($quantity < 1) {
        jsonResponse(['success' => false, 'message' => 'Quantity must be at least 1'], 400);
    }
    
    $userId = getCurrentUserId();
    $sessionId = getSessionId();
    
    if ($userId) {
        $stmt = $pdo->prepare("UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE cart_id = ? AND user_id = ?");
        $result = $stmt->execute([$quantity, $cartId, $userId]);
    } else {
        $stmt = $pdo->prepare("UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE cart_id = ? AND session_id = ?");
        $result = $stmt->execute([$quantity, $cartId, $sessionId]);
    }
    
    if ($result) {
        jsonResponse([
            'success' => true,
            'message' => 'Đã cập nhật số lượng'
        ]);
    } else {
        jsonResponse(['success' => false, 'message' => 'Failed to update'], 500);
    }
}

/**
 * Remove item from cart
 */
function removeFromCart() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['cart_id'])) {
        jsonResponse(['success' => false, 'message' => 'Missing cart_id'], 400);
    }
    
    $cartId = (int)$data['cart_id'];
    $userId = getCurrentUserId();
    $sessionId = getSessionId();
    
    if ($userId) {
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE cart_id = ? AND user_id = ?");
        $result = $stmt->execute([$cartId, $userId]);
    } else {
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE cart_id = ? AND session_id = ?");
        $result = $stmt->execute([$cartId, $sessionId]);
    }
    
    if ($result) {
        jsonResponse([
            'success' => true,
            'message' => 'Đã xóa khỏi giỏ hàng'
        ]);
    } else {
        jsonResponse(['success' => false, 'message' => 'Failed to remove'], 500);
    }
}

/**
 * Clear all cart items
 */
function clearCart() {
    global $pdo;
    
    $userId = getCurrentUserId();
    $sessionId = getSessionId();
    
    if ($userId) {
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE user_id = ?");
        $stmt->execute([$userId]);
    } else {
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE session_id = ?");
        $stmt->execute([$sessionId]);
    }
    
    jsonResponse([
        'success' => true,
        'message' => 'Đã xóa toàn bộ giỏ hàng'
    ]);
}

/**
 * Get cart item count
 */
function getCartCount() {
    global $pdo;
    
    $userId = getCurrentUserId();
    $sessionId = getSessionId();
    
    if ($userId) {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?");
        $stmt->execute([$userId]);
    } else {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM cart_items WHERE session_id = ?");
        $stmt->execute([$sessionId]);
    }
    
    $result = $stmt->fetch();
    
    jsonResponse([
        'success' => true,
        'count' => (int)$result['count']
    ]);
}
?>
