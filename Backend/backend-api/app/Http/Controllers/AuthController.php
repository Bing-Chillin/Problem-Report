<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Requests\RegisterUserRequest;

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
     *             required={"first_name", "last_name", "username", "email", "password", "password_confirmation"},
     *             @OA\Property(property="first_name", type="string", example="John"),
     *             @OA\Property(property="last_name", type="string", example="Doe"),
     *             @OA\Property(property="username", type="string", example="johndoe123"),
     *             @OA\Property(property="email", type="string", format="email", example="johndoe@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="secret123"),
     *            @OA\Property(property="password_confirmation", type="string", format="password", example="secret123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful registration",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="last_name", type="string", example="Doe"),
 *                     @OA\Property(property="username", type="string", example="johndoe123"),
     *                 @OA\Property(property="email", type="string", example="johndoe@example.com"),
     *             ),
     *             @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLC...")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */

    public function register(RegisterUserRequest  $request)
    {
        $formData = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => $request->password,
        ];
  
        $formData['password'] = bcrypt($request->password);
  
        $user = User::create($formData);        
        $user->load('role');
  
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
 *             required={"login","password"},
 *             @OA\Property(property="login", type="string", example="user@example.com or username"),
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

    public function login(LoginUserRequest $request)
    {
        $login = $request->login;
        $password = $request->password;
        
        $loginField = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        
        $credentials = [
            $loginField => $login,
            'password' => $password
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorised'], 401);
        }

        $token = $request->user()->createToken('API Token')->accessToken;
        $user = Auth::user()->load('role');

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }
}
