<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    /**
 * @OA\Delete(
 *     path="/api/users/{id}",
 *     summary="Delete a user by ID (no auth required)",
 *     description="Deletes the user with the given ID without any authorization.",
 *     operationId="deleteUser",
 *     tags={"User"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of user to delete",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="User deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found"
 *     )
 * )
 */

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
