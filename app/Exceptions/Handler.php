<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        // Add custom Inertia error rendering
        $this->renderable(function (Throwable $e, Request $request) {
            $response = parent::render($request, $e);
            $status = $response->getStatusCode();

            if ($request->header('X-Inertia') || $request->wantsJson()) {
                return $response;
            }
            
            if ($this->isHttpException($e)) {
                return $this->renderInertiaErrorPage($e, $status);
            }
            
            if ($status === 500) {
                return $this->renderInertiaErrorPage($e, 500);
            }
            
            return $response;
        });
    }
    
    /**
     * Render an exception using Inertia.
     */
    protected function renderInertiaErrorPage(Throwable $e, int $status): \Illuminate\Http\Response
    {
        // Get appropriate error message based on status code
        $message = match($status) {
            404 => 'The resource you are looking for could not be found.',
            403 => 'You are not authorized to access this resource.',
            419 => 'Your session has expired. Please refresh the page.',
            429 => 'Too many requests. Please try again later.',
            500 => 'An internal server error has occurred.',
            503 => 'The service is unavailable. Please try again later.',
            default => 'An error has occurred.'
        };
        
        // Get status text
        $statusText = match($status) {
            404 => 'Not Found',
            403 => 'Forbidden',
            419 => 'Page Expired',
            429 => 'Too Many Requests',
            500 => 'Server Error',
            503 => 'Service Unavailable',
            default => 'Error'
        };
        
        // Return Inertia response with the error page component
        return Inertia::render('errors/ErrorPage', [
            'status' => $status,
            'statusText' => $statusText,
            'message' => $message,
        ])->toResponse(request())->setStatusCode($status);
    }
}
