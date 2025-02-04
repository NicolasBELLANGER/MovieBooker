// Function Authentification

const user = {
    id: 1,
    name: "nicolas",
    email: "nicolas@gmail.com",
    password: "Nest123!"
};

function generateToken(user){
    const userJson =  JSON.stringify(user);
    const userToken = btoa(userJson);
    return userToken;
}
const token = generateToken(user);
console.log("Voici le token généré :",token);

function verifyToken(userToken){
    const userString = atob(userToken);
    const user = JSON.parse(userString);
    return user;   
}
const userClear = verifyToken(token);
console.log("Voici le user décodé :",userClear);


// Function Filtrage

const users = [
    {
        id: 1,
        name: "nicolas",
        age : 21,
        sexe : "homme",
        email: "nicolas@gmail.com",
        password: "Nest123!"
    },
    {
        id: 2,
        name: "sarah",
        age : 22,
        sexe : "femme",
        email: "sarah@gmail.com",
        password: "Nest123!"
    },
    {
        id: 3,
        name: "etienne",
        age : 45,
        sexe : "homme",
        email: "etienne@gmail.com",
        password: "Nest123!"
    },
    {
        id: 4,
        name: "manon",
        age : 46,
        sexe : "femme",
        email: "manon@gmail.com",
        password: "Nest123!"
    }
];

function Filter(users, critere){
    return users.filter(objet => {
        return Object.keys(critere).every(key => {
            if(critere.age === "moins30"){
                return objet[key] < 30;
            }
            if(critere.age === "plus30"){
                return objet[key] > 30;
            }
            return objet[key] === critere[key];
        });  
    });
}
const homme = Filter(users, {sexe: "homme"} );
console.log("Voici les personnes qui sont des hommes :",homme);

const femme = Filter(users, {sexe: "femme"} );
console.log("Voici les personnes qui sont des femmes :",femme);

const ageOver30 = Filter(users, {age: "plus30"} );
console.log("Voici les personnes qui ont plus de 30 ans :",ageOver30);

const ageUnder30 = Filter(users, {age: "moins30"} );
console.log("Voici les personnes qui ont moins de 30 ans :",ageUnder30);