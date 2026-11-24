/** Une clases condicionales: cn('a', cond && 'b', { c: true }). */
export const cn = (...args) =>
  args
    .flatMap((arg) => {
      if (!arg) return [];
      if (typeof arg === 'string') return [arg];
      if (typeof arg === 'object') {
        return Object.entries(arg)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return [];
    })
    .join(' ');

/** Obtiene el identificador de una entidad sin importar el formato del backend. */
export const getId = (entity) =>
  entity?.customerId ?? entity?._id ?? entity?.id ?? entity?.accountNumber ?? entity?.accountId ?? '';

/** Nombre completo de un cliente. */
export const getCustomerName = (customer) => {
  if (!customer) return '';
  const full = `${customer.firstName ?? customer.name ?? ''} ${customer.lastName ?? ''}`.trim();
  return full || customer.fullName || customer.email || String(getId(customer));
};

/** Mensaje de error legible desde una respuesta de axios. */
export const getErrorMessage = (error, fallback = 'Ocurrió un error inesperado.') => {
  // Sin respuesta: el servidor no está disponible o no hay red
  if (error?.isAxiosError && !error.response) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.';
  }
  const data = error?.response?.data;
  return data?.error || data?.message || error?.message || fallback;
};
