<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $req) {
        $validate = Validator::make($req->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'Invalid Field(s)',
                'errors' => $validate->errors()
            ], 422);
        }

        $user = User::where('email', $req->email)->first();

        if (!$user || !Hash::check($req->password, $user->password)) {
            return response()->json([
                'status' => 'Invalid Credentials'
            ], 401);
        }

        $token = $user->createToken('login_token')->plainTextToken;
        return response()->json([
            'status' => 'Login Successful',
            'user' => $user->makeHidden('password'),
            'token' => $token
        ]);
    }

    public function register(Request $req) {
        $validate = Validator::make($req->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'Invalid Field(s)',
                'errors' => $validate->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $req->name,
            'email' => $req->email,
            'password' => Hash::make($req->password),
            'role' => 'user'
        ]);

        $token = $user->createToken('register_token')->plainTextToken;

        if ($user) {
            return response()->json([
                'status' => 'Registration Successful',
                'user' => $user->makeHidden('password'),
                'token' => $token
            ], 201);
        } else {
            return response()->json([
                'status' => 'Registration Failed'
            ], 500);
        }
    }

    public function logout() {
        $user = Auth::user();

        if ($user) {
            $user->tokens()->delete();
            return response()->json([
                'status' => 'Logout Successful'
            ], 200);
        } else {
            return response()->json([
                'status' => 'Logout Failed'
            ], 401);
        }
    }
}
