
// List of all teams with their proper information
export const TEAMS = [
  { id: "arsenal", name: "London Ágyúk", logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", weight: 1.0, league: "premier-league" },
  { id: "astonvilla", name: "Aston Oroszlán", logoUrl: "https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_FC_crest.svg", league: "premier-league" },
  { id: "brentford", name: "Brentford", logoUrl: "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg", league: "premier-league" },
  { id: "brighton", name: "Brighton", logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg", league: "premier-league" },
  { id: "chelsea", name: "Chelsea", logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg", weight: 0.9, league: "premier-league" },
  { id: "palace", name: "Crystal Palace", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg", league: "premier-league" },
  { id: "everton", name: "Everton", logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg", league: "premier-league" },
  { id: "fulham", name: "Fulham", logoUrl: "https://upload.wikimedia.org/wikipedia/en/3/3e/Fulham_FC_%28shield%29.svg", league: "premier-league" },
  { id: "liverpool", name: "Liverpool", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", weight: 0.9, league: "premier-league" },
  { id: "mancity", name: "Manchester Kék", logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", weight: 0.8, league: "premier-league" },
  { id: "newcastle", name: "Newcastle", logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg", league: "premier-league" },
  { id: "nottingham", name: "Nottingham", logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_FC_logo.svg", league: "premier-league" },
  { id: "tottenham", name: "Tottenham", logoUrl: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg", weight: 1.1, league: "premier-league" },
  { id: "manutd", name: "Vörös Ördögök", logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg", weight: 0.9, league: "premier-league" },
  { id: "westham", name: "West Ham", logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg", league: "premier-league" },
  { id: "wolves", name: "Wolverhampton", logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg", league: "premier-league" },
].sort((a, b) => a.name.localeCompare(b.name));

// Map team names from CSV to team IDs
export const teamNameToId: Record<string, string> = {
  "London Ágyúk": "arsenal",
  "Aston Oroszlán": "astonvilla",
  "Brentford": "brentford",
  "Brighton": "brighton",
  "Chelsea": "chelsea",
  "Crystal Palace": "palace",
  "Everton": "everton",
  "Fulham": "fulham",
  "Liverpool": "liverpool",
  "Manchester Kék": "mancity",
  "Newcastle": "newcastle",
  "Nottingham": "nottingham",
  "Tottenham": "tottenham",
  "Vörös Ördögök": "manutd",
  "West Ham": "westham",
  "Wolverhampton": "wolves"
};

// Available season data URLs
export const AVAILABLE_SEASONS = [
  { id: "20320", name: "2032/0", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20320.csv" },
  { id: "20321", name: "2032/1", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20321.csv" },
  { id: "20322", name: "2032/2", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20322.csv" },
  { id: "20323", name: "2032/3", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20323.csv" },
  { id: "20324", name: "2032/4", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20324.csv" },
  { id: "20325", name: "2032/5", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20325.csv" },
  { id: "20326", name: "2032/6", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20326.csv" },
  { id: "20327", name: "2032/7", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20327.csv" },
  { id: "20328", name: "2032/8", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20328.csv" },
  { id: "20329", name: "2032/9", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20329.csv" },
  { id: "20330", name: "2033/0", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20330.csv" },
  { id: "20331", name: "2033/1", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20331.csv" },
  { id: "20332", name: "2033/2", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20332.csv" },
  { id: "20333", name: "2033/3", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20333.csv" },
  { id: "20334", name: "2033/4", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20334.csv" }
];
