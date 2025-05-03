// const {Users, Materials, Devices, Order} = require("../modelDB");
const db = require('./models');
module.exports = {
    createElementalStructure: async function createElementalStructure() {
        await db.Order.create({status: 'Створено', executorId: "1", userId: "1", price: 0});
        await db.Order.create({status: 'Створено', executorId: "1", userId: "1", price: 0});
        await db.User.create({
            username: '2',
            password: "hash",
            role: 'admin',
            firstName: "Ваня",
            lastName: "Пилипенко",
            familyName: "Юрійович",
            email: "hello@printpeaks.com.ua",
            phoneNumber: "+38 065 666 66 66",
            telegram: "https://t.me/aiatomas",
            discount: "555"
        });
        await db.User.create({
            username: '3',
            password: "awdawdawd",
            role: 'admin',
            firstName: "Ня",
            lastName: "Пилипенко",
            familyName: "Юрійович",
            email: "hello@printpeaks.com.ua",
            phoneNumber: "+38 065 666 66 66",
            telegram: "https://t.me/aiatomas",
            discount: "1"
        });
        await db.User.create({
            username: '4',
            // password: "hash",
            // role: 'admin',
            // firstName: "фцвфцвфцв",
            // lastName: "Пилипенко",
            // familyName: "Юрійович",
            // email: "hello@printpeaks.com.ua",
            // phoneNumber: "+38 065 666 66 66",
            // telegram: "https://t.me/aiatomas",
            discount: "666"
        });
        await db.Material.create({
            article: "0001",
            name: "Друк на цифре",
            type: "Друк",
            typeUse: "Кольоровий",
            unit: "Шт",
            thickness: `2`,
            price1: "10",
            price2: "9",
            price3: "8",
            price4: "7",
            price5: "6",

        })
        await db.Material.create({
            article: "0003",
            name: "Чорнобілий друк",
            type: "Друк",
            typeUse: "Чорнобілий",
            unit: "Шт",
            thickness: `0.4`,
            price1: "3",
            price2: "3",
            price3: "2.5",
            price4: "2.5",
            price5: "2",

        })

        await db.Material.create({
            article: "0006",
            name: "Широкоформат друк",
            type: "Друк",
            typeUse: "Широкоформат",
            unit: "м2",
            thickness: `0.4`,
            price1: "3",
            price2: "3",
            price3: "2.5",
            price4: "2.5",
            price5: "2",

        })
        // await Devices.create({
        //     type: "Послуга",
        //     unit: "Шт",
        //     name: "Цифровий друк",
        // })
        // await Devices.create({
        //     type: "Послуга",
        //     unit: "м2",
        //     name: "Широкоформатний",
        // })
        // await Devices.create({
        //     type: "Послуга",
        //     unit: "Шт",
        //     name: "Фото друк",
        // })

        await db.Material.create({
            article: "0001",
            name: "Офісний папір",
            type: "Папір",
            unit: "Шт",
            thickness: "90",
            price1: "1",
            price2: "1",
            price3: "1",
            price4: "1",
            price5: "1",
            x: "297",
            y: "420",
        });

        await db.Material.create({
            article: "0002",
            name: "Color Copy (DNS), Munken",
            type: "Папір",
            unit: "Шт",
            thickness: "140",
            price1: "10",
            price2: "9",
            price3: "8",
            price4: "7",
            price5: "6",
        });

        await db.Material.create({
            article: "0003",
            name: "Крейдований",
            type: "Папір",
            unit: "Шт",
            thickness: "128",
            price1: "10",
            price2: "9",
            price3: "8",
            price4: "7",
            price5: "6",
        });

        await db.Material.create({
            article: "0004",
            name: "Arena",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "22",
            price2: "21",
            price3: "20",
            price4: "19",
            price5: "18",
        });

        await db.Material.create({
            article: "0005",
            name: "Artelibris",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0006",
            name: "Astroprint",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "25",
            price2: "18",
            price3: "17",
            price4: "16",
            price5: "15",
        });

        await db.Material.create({
            article: "0007",
            name: "Boheme",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "40",
            price2: "33",
            price3: "32",
            price4: "30",
            price5: "29",
        });

        await db.Material.create({
            article: "0008",
            name: "Chagall",
            type: "Папір",
            unit: "Шт",
            thickness: "130",
            price1: "50",
            price2: "40",
            price3: "38",
            price4: "36",
            price5: "35",
        });

        await db.Material.create({
            article: "0009",
            name: "Cocktail",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "75",
            price2: "65",
            price3: "63",
            price4: "61",
            price5: "59",
        });

        await db.Material.create({
            article: "0010",
            name: "Constellation",
            type: "Папір",
            unit: "Шт",
            thickness: "130",
            price1: "25",
            price2: "20",
            price3: "20",
            price4: "20",
            price5: "20",
        });

        await db.Material.create({
            article: "0011",
            name: "Creative board",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "25",
            price2: "18",
            price3: "17",
            price4: "16",
            price5: "15",
        });

        await db.Material.create({
            article: "0012",
            name: "Dali",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "25",
            price2: "18",
            price3: "17",
            price4: "16",
            price5: "15",
        });

        await db.Material.create({
            article: "0013",
            name: "Flora",
            type: "Папір",
            unit: "Шт",
            thickness: "100",
            price1: "30",
            price2: "23",
            price3: "21",
            price4: "19",
            price5: "18",
        });

        await db.Material.create({
            article: "0014",
            name: "GSK EW",
            type: "Папір",
            unit: "Шт",
            thickness: "100",
            price1: "50",
            price2: "40",
            price3: "38",
            price4: "36",
            price5: "35",
        });

        await db.Material.create({
            article: "0015",
            name: "Iceblink",
            type: "Папір",
            unit: "Шт",
            thickness: "90",
            price1: "25",
            price2: "18",
            price3: "17",
            price4: "16",
            price5: "15",
        });

        await db.Material.create({
            article: "0016",
            name: "Imitlin",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0017",
            name: "Ispira",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0018",
            name: "Malmero",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "40",
            price2: "33",
            price3: "32",
            price4: "30",
            price5: "29",
        });

        await db.Material.create({
            article: "0019",
            name: "Materica",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "40",
            price2: "33",
            price3: "32",
            price4: "30",
            price5: "29",
        });

        await db.Material.create({
            article: "0020",
            name: "Natural Evolution",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "40",
            price2: "33",
            price3: "32",
            price4: "30",
            price5: "29",
        });

        await db.Material.create({
            article: "0021",
            name: "Nettuno",
            type: "Папір",
            unit: "Шт",
            thickness: "120-140",
            price1: "45",
            price2: "38",
            price3: "36",
            price4: "35",
            price5: "34",
        });

        await db.Material.create({
            article: "0022",
            name: "Pergamenata",
            type: "Папір",
            unit: "Шт",
            thickness: "115",
            price1: "75",
            price2: "65",
            price3: "63",
            price4: "61",
            price5: "59",
        });

        await db.Material.create({
            article: "0023",
            name: "Plike",
            type: "Папір",
            unit: "Шт",
            thickness: "120-140",
            price1: "93",
            price2: "85",
            price3: "82",
            price4: "80",
            price5: "78",
        });

        await db.Material.create({
            article: "0024",
            name: "Security lune",
            type: "Папір",
            unit: "Шт",
            thickness: "90",
            price1: "30",
            price2: "23",
            price3: "21",
            price4: "19",
            price5: "18",
        });

        await db.Material.create({
            article: "0025",
            name: "Sirio",
            type: "Папір",
            unit: "Шт",
            thickness: "115",
            price1: "40",
            price2: "33",
            price3: "32",
            price4: "30",
            price5: "29",
        });

        await db.Material.create({
            article: "0026",
            name: "Sirio pearl",
            type: "Папір",
            unit: "Шт",
            thickness: "125",
            price1: "65",
            price2: "58",
            price3: "56",
            price4: "54",
            price5: "52",
        });

        await db.Material.create({
            article: "0027",
            name: "SplendorGel",
            type: "Папір",
            unit: "Шт",
            thickness: "100-140",
            price1: "30",
            price2: "23",
            price3: "21",
            price4: "19",
            price5: "18",
        });

        await db.Material.create({
            article: "0028",
            name: "Stardream",
            type: "Папір",
            unit: "Шт",
            thickness: "120",
            price1: "65",
            price2: "58",
            price3: "56",
            price4: "54",
            price5: "52",
        });

        await db.Material.create({
            article: "0029",
            name: "Tintoretto",
            type: "Папір",
            unit: "Шт",
            thickness: "95-140",
            price1: "40",
            price2: "33",
            price3: "32",
            price4: "30",
            price5: "29",
        });

        await db.Material.create({
            article: "0030",
            name: "Woodstock",
            type: "Папір",
            unit: "Шт",
            thickness: "80-110",
            price1: "25",
            price2: "18",
            price3: "17",
            price4: "16",
            price5: "15",
        });

        await db.Material.create({
            article: "0031",
            name: "Color Copy (DNS), Munken",
            type: "Папір",
            unit: "Шт",
            thickness: "145-240",
            price1: "15",
            price2: "14",
            price3: "13",
            price4: "12",
            price5: "11",
        });

        await db.Material.create({
            article: "0032",
            name: "Крейдований",
            type: "Папір",
            unit: "Шт",
            thickness: "150-200",
            price1: "10",
            price2: "9",
            price3: "8",
            price4: "7",
            price5: "6",
        });

        await db.Material.create({
            article: "0033",
            name: "Arena",
            type: "Папір",
            unit: "Шт",
            thickness: "140-200",
            price1: "35",
            price2: "29",
            price3: "28",
            price4: "27",
            price5: "26",
        });

        await db.Material.create({
            article: "0034",
            name: "Astroprint",
            type: "Папір",
            unit: "Шт",
            thickness: "230",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0035",
            name: "Constellation",
            type: "Папір",
            unit: "Шт",
            thickness: "240",
            price1: "75",
            price2: "65",
            price3: "63",
            price4: "61",
            price5: "59",
        });

        await db.Material.create({
            article: "0036",
            name: "Dali",
            type: "Папір",
            unit: "Шт",
            thickness: "160-200",
            price1: "80",
            price2: "72",
            price3: "68",
            price4: "65",
            price5: "62",
        });

        await db.Material.create({
            article: "0037",
            name: "Flora",
            type: "Папір",
            unit: "Шт",
            thickness: "240",
            price1: "75",
            price2: "65",
            price3: "63",
            price4: "61",
            price5: "59",
        });

        await db.Material.create({
            article: "0038",
            name: "GSK EW",
            type: "Папір",
            unit: "Шт",
            thickness: "160",
            price1: "75",
            price2: "65",
            price3: "63",
            price4: "61",
            price5: "59",
        });

        await db.Material.create({
            article: "0039",
            name: "GSK EW",
            type: "Папір",
            unit: "Шт",
            thickness: "200",
            price1: "80",
            price2: "75",
            price3: "70",
            price4: "65",
            price5: "60",
        });

        await db.Material.create({
            article: "0040",
            name: "Icelite",
            type: "Папір",
            unit: "Шт",
            thickness: "180",
            price1: "40",
            price2: "33",
            price3: "32",
            price4: "30",
            price5: "29",
        });

        await db.Material.create({
            article: "0041",
            name: "Malmero",
            type: "Папір",
            unit: "Шт",
            thickness: "165",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0042",
            name: "Nettuno",
            type: "Папір",
            unit: "Шт",
            thickness: "215",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0043",
            name: "Pergamenata",
            type: "Папір",
            unit: "Шт",
            thickness: "230",
            price1: "100",
            price2: "90",
            price3: "95",
            price4: "85",
            price5: "80",
        });

        await db.Material.create({
            article: "0044",
            name: "Sirio",
            type: "Папір",
            unit: "Шт",
            thickness: "210",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0045",
            name: "Sirio pearl",
            type: "Папір",
            unit: "Шт",
            thickness: "230",
            price1: "120",
            price2: "100",
            price3: "90",
            price4: "85",
            price5: "80",
        });

        await db.Material.create({
            article: "0046",
            name: "SplendorGel",
            type: "Папір",
            unit: "Шт",
            thickness: "160-230",
            price1: "40",
            price2: "33",
            price3: "32",
            price4: "30",
            price5: "29",
        });

        await db.Material.create({
            article: "0047",
            name: "Tintoretto",
            type: "Папір",
            unit: "Шт",
            thickness: "200",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0048",
            name: "Color Copy (DNS), Munken",
            type: "Папір",
            unit: "Шт",
            thickness: "300-400",
            price1: "40",
            price2: "35",
            price3: "30",
            price4: "25",
            price5: "20",
        });

        await db.Material.create({
            article: "0049",
            name: "BIO А3",
            type: "Папір",
            unit: "Шт",
            thickness: "300",
            price1: "35",
            price2: "30",
            price3: "25",
            price4: "20",
            price5: "20",
        });

        await db.Material.create({
            article: "0050",
            name: "Крейдований",
            type: "Папір",
            unit: "Шт",
            thickness: "250-350",
            price1: "20",
            price2: "18",
            price3: "16",
            price4: "15",
            price5: "13",
        });

        await db.Material.create({
            article: "0051",
            name: "Arena",
            type: "Папір",
            unit: "Шт",
            thickness: "300",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0052",
            name: "Astroprint",
            type: "Папір",
            unit: "Шт",
            thickness: "280",
            price1: "65",
            price2: "58",
            price3: "56",
            price4: "54",
            price5: "52",
        });

        await db.Material.create({
            article: "0053",
            name: "Boheme",
            type: "Папір",
            unit: "Шт",
            thickness: "320",
            price1: "90",
            price2: "75",
            price3: "70",
            price4: "65",
            price5: "60",
        });

        await db.Material.create({
            article: "0054",
            name: "Chagall",
            type: "Папір",
            unit: "Шт",
            thickness: "260",
            price1: "90",
            price2: "75",
            price3: "70",
            price4: "65",
            price5: "60",
        });

        await db.Material.create({
            article: "0055",
            name: "Cocktail",
            type: "Папір",
            unit: "Шт",
            thickness: "290",
            price1: "100",
            price2: "90",
            price3: "80",
            price4: "70",
            price5: "60",
        });

        await db.Material.create({
            article: "0056",
            name: "Constellation",
            type: "Папір",
            unit: "Шт",
            thickness: "280-350",
            price1: "80",
            price2: "75",
            price3: "70",
            price4: "65",
            price5: "60",
        });

        await db.Material.create({
            article: "0057",
            name: "Creative board",
            type: "Папір",
            unit: "Шт",
            thickness: "270-350",
            price1: "55",
            price2: "45",
            price3: "40",
            price4: "38",
            price5: "35",
        });

        await db.Material.create({
            article: "0058",
            name: "Dali",
            type: "Папір",
            unit: "Шт",
            thickness: "285",
            price1: "85",
            price2: "75",
            price3: "70",
            price4: "65",
            price5: "60",
        });

        await db.Material.create({
            article: "0059",
            name: "Flora",
            type: "Папір",
            unit: "Шт",
            thickness: "350",
            price1: "80",
            price2: "70",
            price3: "65",
            price4: "60",
            price5: "55",
        });

        await db.Material.create({
            article: "0060",
            name: "Formosa",
            type: "Папір",
            unit: "Шт",
            thickness: "250",
            price1: "50",
            price2: "40",
            price3: "38",
            price4: "36",
            price5: "35",
        });

        await db.Material.create({
            article: "0061",
            name: "Iceblink",
            type: "Папір",
            unit: "Шт",
            thickness: "300-350",
            price1: "65",
            price2: "58",
            price3: "56",
            price4: "54",
            price5: "52",
        });

        await db.Material.create({
            article: "0062",
            name: "Icelite",
            type: "Папір",
            unit: "Шт",
            thickness: "250-335",
            price1: "65",
            price2: "58",
            price3: "56",
            price4: "54",
            price5: "52",
        });

        await db.Material.create({
            article: "0063",
            name: "Ispira",
            type: "Папір",
            unit: "Шт",
            thickness: "250",
            price1: "120",
            price2: "100",
            price3: "90",
            price4: "85",
            price5: "80",
        });

        await db.Material.create({
            article: "0064",
            name: "Ispira",
            type: "Папір",
            unit: "Шт",
            thickness: "360",
            price1: "150",
            price2: "140",
            price3: "135",
            price4: "130",
            price5: "120",
        });

        await db.Material.create({
            article: "0065",
            name: "Malmero",
            type: "Папір",
            unit: "Шт",
            thickness: "250-300",
            price1: "80",
            price2: "70",
            price3: "65",
            price4: "60",
            price5: "55",
        });

        await db.Material.create({
            article: "0066",
            name: "Materica",
            type: "Папір",
            unit: "Шт",
            thickness: "360",
            price1: "90",
            price2: "75",
            price3: "72",
            price4: "70",
            price5: "68",
        });

        await db.Material.create({
            article: "0067",
            name: "Natural Evolution",
            type: "Папір",
            unit: "Шт",
            thickness: "280",
            price1: "65",
            price2: "58",
            price3: "56",
            price4: "54",
            price5: "52",
        });

        await db.Material.create({
            article: "0068",
            name: "Nettuno",
            type: "Папір",
            unit: "Шт",
            thickness: "280",
            price1: "100",
            price2: "90",
            price3: "80",
            price4: "70",
            price5: "65",
        });

        await db.Material.create({
            article: "0069",
            name: "Plike",
            type: "Папір",
            unit: "Шт",
            thickness: "330",
            price1: "150",
            price2: "140",
            price3: "135",
            price4: "130",
            price5: "120",
        });

        await db.Material.create({
            article: "0070",
            name: "Sirio",
            type: "Папір",
            unit: "Шт",
            thickness: "290",
            price1: "100",
            price2: "90",
            price3: "80",
            price4: "70",
            price5: "65",
        });

        await db.Material.create({
            article: "0071",
            name: "Sirio pearl",
            type: "Папір",
            unit: "Шт",
            thickness: "300",
            price1: "120",
            price2: "100",
            price3: "90",
            price4: "85",
            price5: "80",
        });

        await db.Material.create({
            article: "0072",
            name: "Sirio tela",
            type: "Папір",
            unit: "Шт",
            thickness: "290",
            price1: "100",
            price2: "90",
            price3: "80",
            price4: "70",
            price5: "65",
        });

        await db.Material.create({
            article: "0073",
            name: "Slide white",
            type: "Папір",
            unit: "Шт",
            thickness: "330",
            price1: "140",
            price2: "125",
            price3: "120",
            price4: "110",
            price5: "100",
        });

        await db.Material.create({
            article: "0074",
            name: "So…silk",
            type: "Папір",
            unit: "Шт",
            thickness: "350",
            price1: "140",
            price2: "125",
            price3: "120",
            price4: "110",
            price5: "100",
        });

        await db.Material.create({
            article: "0075",
            name: "SplendorGel",
            type: "Папір",
            unit: "Шт",
            thickness: "270-330",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0076",
            name: "Stardream",
            type: "Папір",
            unit: "Шт",
            thickness: "285",
            price1: "120",
            price2: "100",
            price3: "90",
            price4: "85",
            price5: "80",
        });

        await db.Material.create({
            article: "0077",
            name: "Tintoretto",
            type: "Папір",
            unit: "Шт",
            thickness: "250-300",
            price1: "65",
            price2: "58",
            price3: "56",
            price4: "54",
            price5: "52",
        });

        await db.Material.create({
            article: "0078",
            name: "Wild",
            type: "Папір",
            unit: "Шт",
            thickness: "300",
            price1: "80",
            price2: "75",
            price3: "70",
            price4: "65",
            price5: "60",
        });

        await db.Material.create({
            article: "0079",
            name: "Woodstock",
            type: "Папір",
            unit: "Шт",
            thickness: "285",
            price1: "60",
            price2: "50",
            price3: "48",
            price4: "46",
            price5: "44",
        });

        await db.Material.create({
            article: "0080",
            name: "Папір білий",
            type: "Плівка",
            unit: "Шт",
            thickness: "70",
            price1: "20",
            price2: "20",
            price3: "20",
            price4: "20",
            price5: "20",
        });

        await db.Material.create({
            article: "0081",
            name: "Папір Glo",
            type: "Плівка",
            unit: "Шт",
            thickness: "70",
            price1: "50",
            price2: "50",
            price3: "50",
            price4: "50",
            price5: "50",
        });

        await db.Material.create({
            article: "0082",
            name: "Папір крафтовий Eden",
            type: "Плівка",
            unit: "Шт",
            thickness: "90",
            price1: "60",
            price2: "60",
            price3: "60",
            price4: "55",
            price5: "50",
        });

        await db.Material.create({
            article: "0083",
            name: "Винний папір Martele",
            type: "Плівка",
            unit: "Шт",
            thickness: "100",
            price1: "60",
            price2: "60",
            price3: "60",
            price4: "55",
            price5: "50",
        });

        await db.Material.create({
            article: "0084",
            name: "Папір StarLight",
            type: "Плівка",
            unit: "Шт",
            thickness: "100",
            price1: "70",
            price2: "70",
            price3: "70",
            price4: "65",
            price5: "60",
        });

        await db.Material.create({
            article: "0085",
            name: "Плівка біла глянцева UPM Raflatac PolyLaser",
            type: "Плівка",
            unit: "Шт",
            thickness: "90",
            price1: "70",
            price2: "70",
            price3: "70",
            price4: "65",
            price5: "60",
        });

        await db.Material.create({
            article: "0086",
            name: "Плівка біла матова UPM Raflatac PolyLaser",
            type: "Плівка",
            unit: "Шт",
            thickness: "90",
            price1: "60",
            price2: "60",
            price3: "60",
            price4: "55",
            price5: "50",
        });

        await db.Material.create({
            article: "0087",
            name: "Плівка прозора глянцева UPM Raflatac PolyLaser",
            type: "Плівка",
            unit: "Шт",
            thickness: "90",
            price1: "60",
            price2: "60",
            price3: "60",
            price4: "55",
            price5: "50",
        });

        await db.Material.create({
            article: "0088",
            name: "Плівка напівпрозора матова UPM Raflatac PolyLaser",
            type: "Плівка",
            unit: "Шт",
            thickness: "90",
            price1: "60",
            price2: "60",
            price3: "60",
            price4: "55",
            price5: "50",
        });


        await db.Material.create({
            article: "0089",
            name: "З глянцевим ламінуванням",
            type: "Ламінування",
            unit: "Шт",
            thickness: "125",
            price1: "40",
            price2: "35",
            price3: "32",
            price4: "30",
            price5: "28",
        });

        await db.Material.create({
            article: "0090",
            name: "З матовим ламінуванням",
            type: "Ламінування",
            unit: "Шт",
            thickness: "125",
            price1: "50",
            price2: "40",
            price3: "37",
            price4: "35",
            price5: "32",
        });

        await db.Material.create({
            article: "0091",
            name: "З ламінуванням Soft Touch",
            type: "Ламінування",
            unit: "Шт",
            thickness: "80",
            price1: "50",
            price2: "40",
            price3: "37",
            price4: "35",
            price5: "32",
        });

        await db.Material.create({
            article: "0092",
            name: "З глянцевим ламінуванням",
            type: "Ламінування",
            unit: "Шт",
            thickness: "30",
            price1: "25",
            price2: "20",
            price3: "18",
            price4: "16",
            price5: "15",
        });

        await db.Material.create({
            article: "0093",
            name: "З матовим ламінуванням",
            type: "Ламінування",
            unit: "Шт",
            thickness: "30",
            price1: "20",
            price2: "18",
            price3: "16",
            price4: "15",
            price5: "13",
        });

        await db.Material.create({
            article: "0094",
            name: "З ламінуванням Soft Touch",
            type: "Ламінування",
            unit: "Шт",
            thickness: "30",
            price1: "25",
            price2: "20",
            price3: "18",
            price4: "16",
            price5: "15",
        });

        await db.Material.create({
            article: "0095",
            name: "З глянцевим ламінуванням",
            type: "Ламінування",
            unit: "Шт",
            thickness: "250",
            price1: "80",
            price2: "75",
            price3: "70",
            price4: "65",
            price5: "60",
        });

        await db.Material.create({
            article: "0096",
            name: "З матовим ламінуванням",
            type: "Ламінування",
            unit: "Шт",
            thickness: "250",
            price1: "100",
            price2: "95",
            price3: "90",
            price4: "85",
            price5: "80",
        });

        await db.Material.create({
            article: "0097",
            name: "З матовим ламінуванням",
            type: "Ламінування",
            unit: "Шт",
            thickness: "100",
            price1: "50",
            price2: "40",
            price3: "37",
            price4: "35",
            price5: "32",
        });


        await db.Material.create({
            article: "0098",
            name: "Матовий плакатний фотопапір",
            type: "Папір Широкоформат",
            unit: "М2",
            thickness: "180",  // Толщина или другой параметр
            price1: "300",  // Цена для 1-3
            price2: "270",  // Цена для 4-10
            price3: "260",  // Цена для 11-20
            price4: "230",  // Цена для 21-50
            price5: "200",  // Цена для 50-
        });

        await db.Material.create({
            article: "0099",
            name: "Фотопапір Сатін",
            type: "Папір Широкоформат",
            unit: "М2",
            thickness: "270",
            price1: "500",  // Цена для 1-3
            price2: "450",  // Цена для 4-10
            price3: "440",  // Цена для 11-20
            price4: "420",  // Цена для 21-50
            price5: "400",  // Цена для 50-
        });

        await db.Material.create({
            article: "0100",
            name: "Офісний папір",
            type: "Папір Широкоформат",
            unit: "М2",
            thickness: "90",
            price1: "0",  // Цена для 1-3
            price2: "0",  // Цена для 4-10
            price3: "0",  // Цена для 11-20
            price4: "0",  // Цена для 21-50
            price5: "0",  // Цена для 50-
        });

        await db.Material.create({
            article: "0101",
            name: "Холст",
            type: "Папір Широкоформат",
            unit: "М2",
            thickness: "440",
            price1: "3200",  // Цена для 1-3
            price2: "2880",  // Цена для 4-10
            price3: "2600",  // Цена для 11-20
            price4: "2500",  // Цена для 21-50
            price5: "2400",  // Цена для 50-
        });

        await db.Material.create({
            article: "0101",
            name: "Згинання",
            type: "Постпресс",
            typeUse: "Згинання",
            unit: "Шт",
            thickness: "0",
            price1: "1",  // Цена для 1-3
            price2: "0.8",  // Цена для 4-10
            price3: "0.5",  // Цена для 11-20
            price4: "0.4",  // Цена для 21-50
            price5: "0.3",  // Цена для 50-
        });
        await db.Material.create({
            article: "0101",
            name: "Скруглення кутів",
            type: "Постпресс",
            typeUse: "Скруглення кутів",
            unit: "Шт",
            thickness: "0",
            price1: "0.5",  // Цена для 1-3
            price2: "0.4",  // Цена для 4-10
            price3: "0.3",  // Цена для 11-20
            price4: "0.2",  // Цена для 21-50
            price5: "0.1",  // Цена для 50-
        });
        await db.Material.create({
            article: "0101",
            name: "Cвердління отворів",
            type: "Постпресс",
            typeUse: "Cвердління отворів",
            unit: "Шт",
            thickness: "0",
            price1: "1",  // Цена для 1-3
            price2: "0.8",  // Цена для 4-10
            price3: "0.5",  // Цена для 11-20
            price4: "0.4",  // Цена для 21-50
            price5: "0.3",  // Цена для 50-
        });
        await db.Material.create({
            article: "0101",
            name: "З плотерною надсічкою на надрукованих аркушах",
            type: "Постпресс",
            typeUse: "Висічка",
            unit: "Шт",
            thickness: "0",
            price1: "20",  // Цена для 1-3
            price2: "20",  // Цена для 4-10
            price3: "20",  // Цена для 11-20
            price4: "20",  // Цена для 21-50
            price5: "20",  // Цена для 50-
        });
        await db.Material.create({
            article: "0101",
            name: "З плотерною порізкою стікерпаків",
            type: "Постпресс",
            typeUse: "Висічка",
            unit: "Шт",
            thickness: "0",
            price1: "20",  // Цена для 1-3
            price2: "20",  // Цена для 4-10
            price3: "20",  // Цена для 11-20
            price4: "20",  // Цена для 21-50
            price5: "20",  // Цена для 50-
        });
        await db.Material.create({
            article: "0101",
            name: "З плотерною порізкою окремими виробами",
            type: "Постпресс",
            typeUse: "Висічка",
            unit: "Шт",
            thickness: "0",
            price1: "50",  // Цена для 1-3
            price2: "50",  // Цена для 4-10
            price3: "50",  // Цена для 11-20
            price4: "50",  // Цена для 21-50
            price5: "50",  // Цена для 50-
        });

        await db.Material.create({
            article: "0003",
            name: "Фото друк А4",
            type: "Друк",
            unit: "Шт",
            thickness: `0.4`,
            price1: "3",
            price2: "3",
            price3: "2.5",
            price4: "2.5",
            price5: "2",
        })

        await db.Material.create({
            article: "0003",
            name: "Фото послуга(фотік)",
            type: "Послуга",
            unit: "Шт",
            thickness: `0.4`,
            price1: "3",
            price2: "3",
            price3: "2.5",
            price4: "2.5",
            price5: "2",
        })

        await db.Material.create({
            article: "0003",
            name: "Фото папір 1",
            type: "Папір",
            typeUse: "Фото",
            unit: "Шт",
            thickness: `0.4`,
            price1: "3",
            price2: "3",
            price3: "2.5",
            price4: "2.5",
            price5: "2",
            x: "100",
            y: "150",
        })

    }
};