<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pastikan user sudah login DAN memiliki role 'admin'
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        // Jika bukan admin, kembalikan respons error Forbidden (403)
        return response()->json([
            'status' => 'error',
            'message' => 'Akses ditolak. Anda tidak memiliki otoritas Admin.'
        ], 403);
    }
}