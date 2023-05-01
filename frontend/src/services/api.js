// backend calls to get data
const API_BASE_URL = process.env.REACT_APP_API_URL;

// returns a list of players
export const fetchPlayers = async () => {
  const response = await fetch(`${API_BASE_URL}/players`);
  const data = await response.json();
  return data.map((player) => ({
    key: player,
    text: player,
    value: player,
  }));
};

// returns a list of events
export const fetchUniqueEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/uniqueEvents`);
  const data = await response.json();
  return data.map((event) => ({
    key: event,
    text: event,
    value: event,
  }));
};

// returns a list of events by player
export const fetchFilteredEvents = async (player, event) => {
  const url = event
    ? `${API_BASE_URL}/filteredEvents?player=${encodeURIComponent(
        player
      )}&event=${encodeURIComponent(event)}`
    : `${API_BASE_URL}/filteredEvents?player=${encodeURIComponent(player)}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// returns a list of event counts by player
export const fetchPlayerEventCounts = async (player) => {
  const response = await fetch(
    `${API_BASE_URL}/playerEventCounts?player=${encodeURIComponent(player)}`
  );
  const data = await response.json();
  return data;
};

// returns the player's team
export const fetchPlayerTeam = async (player) => {
  const response = await fetch(
    `${API_BASE_URL}/playerTeam?player=${encodeURIComponent(player)}`
  );
  const data = await response.json();
  return data;
};
