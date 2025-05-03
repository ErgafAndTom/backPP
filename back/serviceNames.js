module.exports = {
    getNameService: function (nameService) {
        switch (nameService) {
            case "digital":
                return "Цифровий друк"
            case "wide":
                return "Широкоформатний друк"
            case "photo":
                return "Фото друк"
            case "cup":
                return "Друк на чашках"
            case "afterPrint":
                return "Післядрукарські послуги"
            default:
                return ""
        }
    }
}