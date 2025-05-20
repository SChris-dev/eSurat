<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Letter;
use App\Models\Download;


class DownloadController extends Controller
{
    public function store(string $id) {
        $user = Auth::user();
        $letter = Letter::find($id);

        if (!$letter || !file_exists(public_path($letter->file_path))) {
            return response()->json([
                'status' => 'Letter not found',
                'message' => 'The requested letter does not exist.'
            ], 404);
        }

        Download::create([
            'user_id' => $user->id,
            'letter_id' => $letter->id,
            'downloaded_at' => now()
        ]);

        return response()->download(public_path($letter->file_path));
    }

    public function index() {
        $user = Auth::user();

        $downloads = $user->role === 'admin'
            ? Download::with(['user', 'letter'])->latest()->get()
            : Download::with('letter')->where('user_id', $user->id)->latest()->get();

        return response()->json([
            'status' => 'index success',
            'data' => $downloads
        ], 200);
    }
}
