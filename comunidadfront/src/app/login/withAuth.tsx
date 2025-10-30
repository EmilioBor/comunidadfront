import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React from "react";

// HOC tipado genéricamente
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const AuthComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const token = Cookies.get("auth_token"); // Obtener el token de las cookies

    useEffect(() => {
      if (!token) {
        // Si no hay token, redirigir al usuario a la página de inicio de sesión
        router.push("/login");
      }
    }, [token, router]);

    // Renderiza el componente solo si hay token
    return token ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
}

export default withAuth;
