class DateHelper {
    constructor() {
        throw new Error('Você não pode criar uma instância dessa classe');
    }
    static textoParaData(texto) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(texto))
            throw new Error("Formado de data inválida - Esperado aaaa-mm-dd");
        return new Date(texto.split("-"));
    }
    static dataParaTexto(data) {
        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    }
}