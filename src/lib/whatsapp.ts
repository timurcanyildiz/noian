/** WhatsApp sohbet bağlantısı üretir. */
export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function whatsappProductMessage(productName: string): string {
  return `Merhaba, ${productName} hakkında bilgi almak istiyorum.`;
}
