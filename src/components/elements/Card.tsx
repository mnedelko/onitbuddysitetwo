import styled from "styled-components";
import {Paper} from "@material-ui/core";

//Styled Components
const Card = styled(Paper)`
  display: inline-block;
  background-color: var(countdown-background-color) !important;
  margin: 5px;
  min-width: 40px;
  padding: 24px;
  h1{
    margin:0px;
  }
`;

export default Card