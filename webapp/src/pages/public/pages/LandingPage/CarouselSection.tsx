import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Card, CardMedia, darken, Theme, useTheme} from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import GrandTheftAutoVMap from '../../../../images/maps/map_gtav.jpg'
import CyberpunkMap from '../../../../images/maps/map_cyberpunk.png'
import SkyrimMap from '../../../../images/maps/map_skyrim.jpg'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: '#c9c9c9',
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
  const theme = useTheme();

  return (
    <Box mb={25}>
      <div style={{height: '150px', width: '100%', overflow: 'hidden'}}>
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{height: '100%', width: '100vw',}}>
          <path d="M0.00,49.99 C221.44,236.15 349.20,-49.99 500.00,49.99 L500.00,150.00 L0.00,150.00 Z"
                style={{stroke: 'none', fill: '#c9c9c9'}}></path>
        </svg>
      </div>
      <Box py={4} className={classes.root}>
        <Carousel className={classes.carousel}>
          {
            carouselItems.map(
              (item, i) => <Item key={i} item={item} />)
          }
        </Carousel>
      </Box>
      <div style={{height: '150px', overflow: 'hidden', marginBottom: '-150px'}}>
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{height: '7vw', width: '100%'}}>
          <path d="M0.00,49.99 C150.00,150.00 271.49,-49.99 500.00,49.99 L500.00,0.00 L0.00,0.00 Z"
                style={{stroke: 'none', fill: '#c9c9c9'}}></path>
        </svg>
      </div>
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