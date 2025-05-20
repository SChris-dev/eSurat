<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use App\Models\Letter;

class LetterController extends Controller
{
    public function index() {
        $letters = Letter::with('category')->get();
        return response()->json([
            'status' => 'index success',
            'data' => $letters
        ], 200);
    }

    public function store(Request $req) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Unauthorized',
                'message' => 'You are not authorized to upload letters.'
            ], 403);
        }

        $validate = Validator::make($req->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,txt,xls,xlsx,zip,rar,7z,jpg,jpeg,png|max:20480'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'Invalid Field(s)',
                'message' => $validate->errors()
            ], 422);
        }

        $file = $req->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads'), $fileName);
        $letter = Letter::create([
            'title' => $req->title,
            'description' => $req->description,
            'category_id' => $req->category_id,
            'file_path' => 'uploads/' . $fileName,
            'uploaded_by' => $user->id
        ]);

        return response()->json([
            'status' => 'store success',
            'data' => $letter
        ], 201);
    }

    public function show(string $id) {
        $letter = Letter::with('category')->find($id);

        if (!$letter) {
            return response()->json([
                'status' => 'Letter Not Found',
                'message' => 'Letter not found'
            ], 404);
        }

        return response()->json([
            'status' => 'show success',
            'data' => $letter
        ], 200);
    }

    public function update(Request $req, string $id) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Unauthorized',
                'message' => 'You are not authorized to update letters.'
            ], 403);
        }

        $letter = Letter::find($id);

        if (!$letter) {
            return response()->json([
                'status' => 'Letter Not Found',
                'message' => 'Letter not found'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'category_id' => 'exists:categories,id',
            'file' => 'file|mimes:pdf,doc,docx,ppt,pptx,txt,xls,xlsx,zip,rar,7z,jpg,jpeg,png|max:20480'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'Invalid Field(s)',
                'message' => $validate->errors()
            ], 422);
        }

        if ($req->hasFile('file')) {

            if (file_exists(public_path($letter->file_path))) {
                unlink(public_path($letter->file_path));
            }

            $file = $req->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $fileName);
            $letter->file_path = 'uploads/' . $fileName;
        }

        if ($req->has('title')) {
            $letter->title = $req->title;
        }

        if ($req->has('description')) {
            $letter->description = $req->description;
        }

        if ($req->has('category_id')) {
            $letter->category_id = $req->category_id;
        }

        $letter->save();

        return response()->json([
            'status' => 'update success',
            'data' => $letter
        ], 200);
    }

    public function destroy(string $id) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Unauthorized',
                'message' => 'You are not authorized to delete letters.'
            ], 403);
        }

        $letter = Letter::find($id);

        if (!$letter) {
            return response()->json([
                'status' => 'Letter Not Found',
                'message' => 'Letter not found',
            ], 404);
        }

        if (file_exists(public_path($letter->file_path))) {
            unlink(public_path($letter->file_path));
        }

        $letter->delete();

        return response()->json([
            'status' => 'delete success',
            'message' => 'Letter deleted successfully'
        ], 200);
    }
}
