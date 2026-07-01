# Import necessary libraries
import requests, xlsxwriter

# Pokemon API
base_url = "https://pokeapi.co/api/v2/"

# Function that gets pokemon by ID
def GetPokemonInfo(id):
    url = f"{base_url}/pokemon/{id}"
    response = requests.get(url)

    if response.status_code == 200:
        pokemon_data = response.json()
        return pokemon_data
    else:
        print("Failed to retrieve data")


all_pokemons = []

# The incrementing variable for the loop, will iterate through every Pokemon
pokemon_id = 1

# Get Pokémon from the API and add them to the dictionary
while True:

    # Request Pokémon by ID
    try:
        pokemon_info = GetPokemonInfo(pokemon_id)
        
        if not pokemon_info:
            print(f"Pokemon ID {pokemon_id} was not found, no more Pokemon to extract, breaking loop")
            break

        # Get Multiple Attribute Values from Types
        types = pokemon_info["types"]
        type_names = [t["type"]["name"] for t in types]

        # Save Base Stats Attributes in Dictionary
        pokemon_stats = {}
        for stat in pokemon_info["stats"]:
            pokemon_stats[stat["stat"]["name"]] = stat["base_stat"]

        current_pokemon = {
            "ID": pokemon_info["id"],
            "NAME": pokemon_info["name"].capitalize(),
            "TYPES": "/".join(type_names),
            "HEIGHT": pokemon_info["height"] * 0.1, # Meters = decimeters * 0.1
            "WEIGHT": pokemon_info["weight"] * 0.1, # Kilograms = hectograms * 0.1
            "HP": pokemon_stats["hp"],
            "ATTACK": pokemon_stats["attack"],
            "DEFENSE": pokemon_stats["defense"],
            "SPECIAL_ATTACK": pokemon_stats["special-attack"],
            "SPECIAL_DEFENSE": pokemon_stats["special-defense"],
            "SPEED": pokemon_stats["speed"],
            "IMG": pokemon_info["sprites"]["front_default"]
        }

        all_pokemons.append(current_pokemon)  
        print(f"Current Added Pokemon: {pokemon_id}")
        pokemon_id += 1     

    except Exception as e:
        print(f"Error with Pokémon ID {pokemon_id}: {e}")
        break


# Create Excel file and Excel sheet
workbook = xlsxwriter.Workbook("Pokemons.xlsx")
worksheet = workbook.add_worksheet("Pokedex")

# Create Columns for Excel file
for col_index, key in enumerate(all_pokemons[0].keys()):
    worksheet.write(0, col_index, key)

# Write all pokemon data to Excel File
for row_index, pokemon in enumerate(all_pokemons):
    col_index = 0
    for value in pokemon.values():
        worksheet.write(row_index + 1, col_index, value)
        col_index += 1

workbook.close()


