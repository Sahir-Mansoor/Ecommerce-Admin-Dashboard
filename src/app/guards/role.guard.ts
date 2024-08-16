import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../demo/service/user.service';



export const roleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  // Extract allowed roles from route data
  const allowedRoles = route.data['roles'] as string[];
  const userRole = userService.getRole();

  // Check if user role is in the list of allowed roles
  if (allowedRoles.includes(userRole)) {
    return true; // Allow access
  } else {
    router.navigate(['/auth/login']); // Redirect if not allowed
    return false; // Deny access
  }
};