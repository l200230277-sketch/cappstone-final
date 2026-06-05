import json
from functools import wraps

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def api_view(methods=None):
    """Decorator API JSON mirip Express — CSRF exempt, parse body JSON."""

    def decorator(view_func):
        @csrf_exempt
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if methods and request.method not in methods:
                return JsonResponse(
                    {'message': 'Method not allowed'},
                    status=405,
                )
            if request.body:
                try:
                    request.json_body = json.loads(request.body.decode('utf-8'))
                except json.JSONDecodeError:
                    return JsonResponse(
                        {'message': 'JSON tidak valid'},
                        status=400,
                    )
            else:
                request.json_body = {}
            return view_func(request, *args, **kwargs)

        return wrapper

    return decorator
