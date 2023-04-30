const API_BASE_URL = "http://localhost:8080";

export const fetchPlayers = async () => {
  const response = await fetch(`${API_BASE_URL}/players`);
  const data = await response.json();
  return data.map((player) => ({
    key: player,
    text: player,
    value: player,
  }));
};

export const fetchUniqueEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/uniqueEvents`);
  const data = await response.json();
  return data.map((event) => ({
    key: event,
    text: event,
    value: event,
  }));
};

export const fetchPlayerEventCounts = async (player) => {
  const response = await fetch(
    `${API_BASE_URL}/playerEventCounts?player=${encodeURIComponent(player)}`
  );
  const data = await response.json();
  return data;
};

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

export const fetchPlayerTeam = async (player) => {
    const response = await fetch(
      `${API_BASE_URL}/playerTeam?player=${encodeURIComponent(player)}`
    );
    const data = await response.json();
    return data;
  };
