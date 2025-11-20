<?php
/**
 * Image Reorder API Endpoint
 * Handles batch reordering of images via POST (avoids PUT method issues on shared hosting)
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../utils.php';

setCORSHeaders();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method !== 'POST') {
    sendError('Method not allowed. Use POST.', 405);
}

$db = getDB();

try {
    $data = getRequestBody();

    if (!isset($data['images']) || !is_array($data['images'])) {
        sendError('Images array is required');
    }

    $images = $data['images'];
    $updated = 0;

    // Begin transaction for atomic update
    $db->beginTransaction();

    try {
        $stmt = $db->prepare("UPDATE vizzy_images SET display_order = :display_order WHERE id = :id");

        foreach ($images as $index => $image) {
            if (!isset($image['id'])) {
                throw new Exception('Image ID missing at index ' . $index);
            }

            $imageId = (int)$image['id'];
            $displayOrder = $index;

            $success = $stmt->execute([
                'id' => $imageId,
                'display_order' => $displayOrder
            ]);

            if ($success) {
                $updated++;
            }

            error_log("Reorder: Image ID {$imageId} → display_order {$displayOrder}");
        }

        $db->commit();

        sendJSON([
            'message' => 'Images reordered successfully',
            'updated' => $updated,
            'total' => count($images)
        ]);

    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}
