<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

use App\Models\Category;


class CategoryController extends Controller
{
    public function index() {
        $categories = Category::all();
        return response()->json([
            'status' => 'index success',
            'data' => $categories
        ], 200);
    }

    public function store(Request $req) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Unauthorized',
                'message' => 'You are not authorized to create categories.'
            ], 403);
        }

        $validate = Validator::make($req->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'Invalid Field(s)',
                'message' => $validate->errors()
            ], 422);
        }

        $category = Category::create([
            'name' => $req->name,
            'slug' => $req->slug ?? Str::slug($req->name, '-')
        ]);

        return response()->json([
            'status' => 'store success',
            'data' => $category
        ], 201);
    }

    public function show(string $id) {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 'Category Not Found',
                'message' => 'Category with ID ' . $id . ' not found.'
            ], 404);
        }

        return response()->json([
            'status' => 'show success',
            'data' => $category
        ], 200);
    }

    public function update(Request $req, string $id) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Unauthorized',
                'message' => 'You are not authorized to update categories.'
            ], 403);
        }

        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 'Category Not Found',
                'message' => 'Category with ID ' . $id . ' not found.'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'name' => 'string|max:255',
            'slug' => 'nullable|string'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'Invalid Field(s)',
                'message' => $validate->errors()
            ], 422);
        }

        $category->update($req->only(['name', 'slug']));

        return response()->json([
            'status' => 'update success',
            'data' => $category
        ], 200);
    }

    public function destroy(string $id) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Unauthorized',
                'message' => 'You are not authorized to delete categories.'
            ], 403);
        }

        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 'Category Not Found',
                'message' => 'Category with ID ' . $id . ' not found.'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status' => 'delete success',
            'message' => 'Category with ID ' . $id . ' deleted successfully.'
        ], 200);
    }
}
