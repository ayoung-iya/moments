import Button from "./button";
import ButtonLIst from "./buttonList";
import Container from "./container";
import Content from "./content";
import Image from "./image";
import NameWithDate from "./nameWithDate";

const Tweet = Object.assign(Container, {
  Button,
  ButtonLIst,
  Content,
  Image,
  NameWithDate,
});

export default Tweet;
