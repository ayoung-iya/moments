import ButtonList from "./buttonList";
import Container from "./container";
import Content from "./content";
import Image from "./image";
import NameWithDate from "./nameWithDate";

const Tweet = Object.assign(Container, {
  ButtonList,
  Content,
  Image,
  NameWithDate,
});

export default Tweet;
