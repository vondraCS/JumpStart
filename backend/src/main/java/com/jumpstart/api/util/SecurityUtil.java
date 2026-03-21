package com.jumpstart.api.util;

import com.jumpstart.api.entity.UserPrinciple;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    private SecurityUtil() {}

    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrinciple)) {
            throw new IllegalStateException("No authenticated founder in context");
        }
        return ((UserPrinciple) auth.getPrincipal()).getId();
    }
}
