import React, { useState, useEffect } from "react";
import { Card, Image, Grid } from "semantic-ui-react";
import "./UserCard.css";
import randomPic from "../../utilities/randomPic";

import { fetchPlayerEventCounts, fetchPlayerTeam } from "../../services/api";

const eventPluralMap = {
  "Faceoff Win": "Faceoff Wins",
  "Puck Recovery": "Puck Recoveries",
  "Dump In/Out": "Dump Ins/Outs",
  "Play": "Plays",
  "Shot": "Shots",
  "Penalty Taken": "Penalties Taken",
  "Zone Entry": "Zone Entries",
  "Takeaway": "Takeaways",
  "Incomplete Play": "Incomplete Plays",
  "Goal": "Goals",
};

const UserCard = ({ player }) => {
  const [eventCounts, setEventCounts] = useState(null);
  const [teamName, setTeamName] = useState(null);

  // Get Player Card details
  useEffect(() => {
    if (!player) return;

    const fetchData = async () => {
      const data = await fetchPlayerEventCounts(player);
      const teamData = await fetchPlayerTeam(player);
      setEventCounts(data);
      setTeamName(teamData.team);
    };

    fetchData();
  }, [player]);

  if (!eventCounts || !teamName) return null;

  return (
    <Card fluid className="UserCard">
      {/* Profile Image */}
      <Image src={randomPic(player)} wrapped ui={false} />

      {/* Player Details */}
      <Card.Content>
        <Card.Header>{player}</Card.Header>
        <Card.Meta>
          <span>{teamName}</span>
        </Card.Meta>
      </Card.Content>

      {/* Player Statistics */}
      <Card.Content>
        <Grid columns={2} relaxed="very">
          {Object.entries(eventCounts).map(([eventName, details]) => (
            <Grid.Column key={eventName}>
              <h4>{eventPluralMap[eventName]}:</h4>
              {Object.entries(details.detail_1).map(([detailName, count]) => (
                <p key={detailName}>
                  {detailName}: {count}
                </p>
              ))}
            </Grid.Column>
          ))}
        </Grid>
      </Card.Content>

      {/* Image Credit */}
      <Card.Content extra>
        <a href="http://www.freepik.com">
          Avatar images from pikisuperstar / Freepik
        </a>
      </Card.Content>
    </Card>
  );
};

export default UserCard;
