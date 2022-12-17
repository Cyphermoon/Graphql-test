const continent_list = document.querySelector("#continent_list")
const countries_list = document.querySelector("#countries_list")

//Request for continents using graphql query
fetchRequest(`
    query getContinents{
        continents{
            code
            name
        }
    }
`)
    .then((res) => res.json())
    .then((resData) => {
        //create option tag with continent name and code 
        //Then append option tag to the parent element

        let continents = resData.data.continents
        continents.forEach(continent => {
            let option = document.createElement("option")
            option.setAttribute("value", continent.code)
            option.innerText = continent.name
            continent_list.append(option)
        });
    })

continent_list.addEventListener("change", async (e) => {
    const value = e.target.value
    const countryData = await getCountries(value)

    countries_list.innerHTML = " "
    countryData.forEach((data) => {
        let paragraph = document.createElement("p")
        paragraph.innerText = data.name
        countries_list.append(paragraph)
    })
})

async function getCountries(countryCode) {
    const res = await fetchRequest(`
            query getCountries($code:ID!){
                continent(code: $code){
                countries{
                name
                }
            }
            }`, { "code": countryCode })

    const resData = await res.json()
    return resData.data.continent.countries
}


function fetchRequest(query, variables) {
    //Request for the specified url
    return fetch("https://countries.trevorblades.com/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query,
            variables
        }),
    })
}


