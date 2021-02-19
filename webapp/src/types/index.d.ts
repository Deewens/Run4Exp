declare module "@acrobatt" {
  type Dimension = {
    width: number
    height: number
  }

  type Point = {
    x: number,
    y: number
  }

  type LineCoords = {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  }

  interface Segment {
    name?: string;
    start: Point;
    end: Point;
    coords: Point[];
  }

  interface Checkpoint {
    name: string;
    position: Point;
    type: 0 | 1 | 2;
  }

  interface Challenge {
    id?: number
    name: string;
    description: string;
    scale: number;
    obstacles?: [];
    checkpoints: Checkpoint[];
    segments: Segment[];
  }

  // Leaflet
  type LeafletPositionClasses = {
    bottomLeft: string;
    bottomRight: string;
    topLeft: string;
    topRight: string;
  }

  // Entity
  interface User {
    id?: number
    name: string
    firstName: string
    email: string
    password?: string
  }

  type UserSignIn = {
    email: string
    password: string
  }

  type UserSignUp = {
    name: string
    firstName: string
    email: string
    password: string
    passwordConfirmation: string
  }

  type ChallengeCreate = {
    name: string
    description: string
  }

  type Error = {
    data: string,
    status: number
  }

  interface AuthContextType {
    user: User | null,
    signup: (user: UserSignUp) => Promise<void>
    signin: (user: UserSignIn) => Promise<void>
  }

  interface CheckpointCreate {
    challengeId: number
    name: string;
    x: number
    y: number
    checkpointType: 0
  }

  interface SegmentCreate {
    coordinates: Point[]
    endpointStartId: number
    endpointEndId: number
    name: string
    length: number
  }
}