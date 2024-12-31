import { useNavigate } from "react-router-dom";
import {ArrowIcon} from '../assets';
import styled from "styled-components";

const Home = () => {
  const navigate = useNavigate();
  const availableTracks = ["Ate_Que_A_Casa_Esteja_Cheia", "Belief", "Nivel_Raso"];

  return (
    <Container>
      <Title>Audio Separator</Title>

      <TracksContainer>
        <Subtitle>Track List</Subtitle>

        {availableTracks.map((it) => (
          <Track onClick={() => navigate(`/stem-player/${it}`)}>
            <p>{it.split('_').join(" ")}</p>
            <img src={ArrowIcon} alt="Arrow icon"/>
          </Track>
        ))}
      </TracksContainer>
    </Container>
  );
}

export default Home;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5rem;
`

const Title = styled.h1``

const Subtitle = styled.h2`
  margin: .5rem 0;
`

const TracksContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1.5rem;
  width: 35rem;
`

const Track = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid #D3D3D3 ;
  border-radius: .5rem;
  height: 3rem;
  align-items: center;
  padding: 0 1rem;
  transition: 300ms;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  cursor: pointer;

  p {
    margin: 0;
    font-weight: 500;
  }

  img {
    width: 1.8rem;
    height: 1.8rem;
  }

  &:hover {
    border: 1px solid #A9A9A9;
  }
`