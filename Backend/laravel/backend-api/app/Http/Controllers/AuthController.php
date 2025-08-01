<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

/**
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     in="header"
 * )
 *  @OA\SecurityRequirement(
 *     "bearerAuth": {}
 * )
 */

class AuthController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/register",
     *     tags={"Auth"},
     *     summary="Register a new user",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="johndoe@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="secret123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful registration",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="email", type="string", example="johndoe@example.com"),
     *             ),
     *             @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLC...")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */

    public function register(Request $request)
    {
        $formData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ];
  
        $formData['password'] = bcrypt($request->password);
  
        $user = User::create($formData);        
  
        return response()->json([ 
            'user' => $user, 
            'token' => $user->createToken('passportToken')->accessToken
        ], 200);
          
    }

/**
 * @OA\Post(
 *     path="/api/login",
 *     tags={"Auth"},
 *     summary="Login a user",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email","password"},
 *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="password")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successful login",
 *         @OA\JsonContent(
 *             @OA\Property(property="token", type="string"),
 *             @OA\Property(property="user", type="object")
 *         )
 *     ),
 *     @OA\Response(response=401, description="Unauthorized")
 * )
 */

    public function login(Request $request)
    {
        $credentials = [
            'email'    => $request->email,
            'password' => $request->password
        ];
  
        if (Auth::attempt($credentials)) 
        {
            $user = User::where('email', $request->email)->first();
            $token = $user->createToken('passportToken')->accessToken; //TODO: Auth::user() is not available here, so we fetch the user again.

            //$token = Auth::user()->createToken('passportToken')->accessToken;

            return response()->json([
                'user' => Auth::user(), 
                'token' => $token
            ], 200);
        }
  
        return response()->json([
            'error' => 'Unauthorised'
        ], 401);
  
    }
}
