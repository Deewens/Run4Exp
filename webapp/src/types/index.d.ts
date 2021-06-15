declare module "@acrobatt" {
  type Dimension = {
    width: number
    height: number
  }

  interface IPoint {
    x: number
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
    start: IPoint;
    end: IPoint;
    coords: IPoint[];
  }

  interface Checkpoint {
    name: string;
    position: IPoint;
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
    coordinates: IPoint[]
    endpointStartId: number
    endpointEndId: number
    name: string
    length: number
  }

  type CheckpointType = "BEGIN" | "MIDDLE" | "END"

  type UserSessionApi = {
    id: number
    challengeId: number
    userId: number
    events: EventSessionApi[]
  }

  type EventSessionApi = {
    date: number
    type: string
    value: string
  }
}