import React, { useState, useEffect } from "react";
import { Card, Image, Grid } from "semantic-ui-react";
import "./UserCard.css";
import randomPic from "../../actions/randompic/randomPic";

import { fetchPlayerEventCounts, fetchPlayerTeam } from "../../services/api";

const UserCard = ({ player }) => {
  const [eventCounts, setEventCounts] = useState(null);
  const [teamName, setTeamName] = useState(null);

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
      <Image src={randomPic(player)} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{player}</Card.Header>
        <Card.Meta>
          <span>{teamName}</span>
        </Card.Meta>
      </Card.Content>
      <Card.Content>
        <Grid columns={2} relaxed="very">
          {Object.entries(eventCounts).map(([eventName, details]) => (
            <Grid.Column key={eventName}>
              <h4>{eventName}:</h4>
              {Object.entries(details.detail_1).map(([detailName, count]) => (
                <p key={detailName}>
                  {detailName}: {count}
                </p>
              ))}
            </Grid.Column>
          ))}
        </Grid>
      </Card.Content>
      <Card.Content extra>
        <a href="http://www.freepik.com">
          Image taken from pikisuperstar / Freepik
        </a>
      </Card.Content>
    </Card>
  );
};

export default UserCard;
