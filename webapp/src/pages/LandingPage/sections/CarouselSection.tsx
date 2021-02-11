import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Card, CardMedia, Theme} from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import GrandTheftAutoVMap from '../../../images/maps/map_gtav.jpg'
import CyberpunkMap from '../../../images/maps/map_cyberpunk.png'
import SkyrimMap from '../../../images/maps/map_skyrim.jpg'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: '#EEEEEE'
  },
  carousel: {
    margin: 'auto',
    maxWidth: '1000px',
    position: 'relative'
  },
}))

let carouselItems: Array<CarouselItem> = [
  {
    name: "Image 1",
    description: 'no need for desc',
    image: SkyrimMap
  },
  {
    name: 'Image 2',
    description: 'again, no need',
    image: CyberpunkMap
  },
  {
    name: 'Image 3',
    description: 'again, no need',
    image: GrandTheftAutoVMap
  },
];

export const CarouselSection = () => {
  const classes = useStyles();

  return (
      <Box py={4} className={classes.root}>
        <Carousel className={classes.carousel}>
          {
            carouselItems.map(
              (item, i) => <Item key={i} item={item} />)
          }
        </Carousel>
      </Box>
  )
}

type CarouselItem = {
  name: string,
  description: string,
  image: string
}

type Props = {
  item: CarouselItem
}

const Item = ({item}: Props) => {
  return (
    <Card raised>
      <CardMedia
        component="img"
        image={item.image}
        title={item.name}
        style={{
          height: 'auto',
          width: '100%',
        }}
      />
    </Card>
  )
}