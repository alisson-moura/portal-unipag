export const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "APPR":
    case "APROVADA":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "DECL":
    case "NEGADA":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status.toUpperCase()) {
    case "APPR":
      return "Aprovada";
    case "DECL":
      return "Negada";
    default:
      return status;
  }
};

export const getPaymentMethodLabel = (paymentMethod: string) => {
  switch (paymentMethod.toUpperCase()) {
    case "CHCK":
      return "Débito à vista";
    case "CRDT":
      return "Crédito à vista";
    case "CRDT_PARC":
      return "Crédito parcelado";
    default:
      return paymentMethod;
  }
};

export const getPaymentMethodColor = (paymentMethod: string) => {
  switch (paymentMethod.toUpperCase()) {
    case "CHCK":
      return "bg-blue-100 text-blue-800";
    case "CRDT":
      return "bg-purple-100 text-purple-800";
    case "CRDT_PARC":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
