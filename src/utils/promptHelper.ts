
/**

 * @param {string} documentType 
 * @returns {string} 
 */
export const generatePrompt = (documentType: string): string => {
    switch (documentType) {
      case 'fatura':
        return "Extraia o valor total da fatura e o consumo de água desta conta da COPASA. portugues";
      case 'recibo':
        return "Extraia o valor total do recibo e os detalhes de pagamento. portugues";
        case'imagem':
        return "Extraia o valor total do recibo e os detalhes de pagamento. portugues"
      default:
        return "Extraia informações relevantes numeridas do documento. portugues";
    }
  };
  