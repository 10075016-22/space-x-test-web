// Tipos principales para la aplicación SpaceX Web

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  date_local: string;
  success: boolean | null;
  upcoming: boolean;
  details: string | null;
  flight_number: number;
  rocket: Rocket;
  launchpad: Launchpad;
  links: LaunchLinks;
  crew: CrewMember[];
  ships: string[];
  capsules: string[];
  payloads: Payload[];
  cores: Core[];
  failures: Failure[];
  auto_update: boolean;
  tbd: boolean;
  net: boolean;
  window: number | null;
  static_fire_date_utc: string | null;
  static_fire_date_unix: number | null;
  timeline: Timeline | null;
}

export interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  height: Dimension;
  diameter: Dimension;
  mass: Mass;
  payload_weights: PayloadWeight[];
  first_stage: Stage;
  second_stage: Stage;
  engines: Engine;
  landing_legs: LandingLegs;
  flickr_images: string[];
  wikipedia: string;
  description: string;
}

export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  status: string;
  locality: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  rockets: string[];
  launches: string[];
  details: string;
  images: LaunchpadImages;
}

export interface LaunchLinks {
  patch: Patch;
  reddit: Reddit;
  flickr: Flickr;
  presskit: string | null;
  webcast: string | null;
  youtube_id: string | null;
  article: string | null;
  wikipedia: string | null;
}

export interface CrewMember {
  crew: string;
  role: string;
}

export interface Payload {
  id: string;
  name: string;
  type: string;
  reused: boolean;
  launch: string;
  customers: string[];
  norad_ids: number[];
  nationalities: string[];
  manufacturers: string[];
  mass_kg: number | null;
  mass_lbs: number | null;
  orbit: string;
  reference_system: string;
  regime: string;
  longitude: number | null;
  semi_major_axis_km: number | null;
  eccentricity: number | null;
  periapsis_km: number | null;
  apoapsis_km: number | null;
  inclination_deg: number | null;
  period_min: number | null;
  lifespan_years: number | null;
  epoch: string | null;
  mean_motion: number | null;
  raan: number | null;
  arg_of_pericenter: number | null;
  mean_anomaly: number | null;
  dragon: Dragon;
}

export interface Core {
  core: string;
  flight: number;
  gridfins: boolean;
  legs: boolean;
  reused: boolean;
  landing_attempt: boolean;
  landing_success: boolean | null;
  landing_type: string | null;
  landpad: string | null;
}

export interface Failure {
  time: number;
  altitude: number | null;
  reason: string;
}

export interface Timeline {
  webcast_liftoff: number | null;
  go_for_prop_loading: number | null;
  rp1_loading: number | null;
  stage1_rp1_loading: number | null;
  stage1_lox_loading: number | null;
  stage2_rp1_loading: number | null;
  stage2_lox_loading: number | null;
  engine_chill: number | null;
  prelaunch_checks: number | null;
  propellant_pressurization: number | null;
  go_for_launch: number | null;
  ignition: number | null;
  liftoff: number | null;
  maxq: number | null;
  beco: number | null;
  side_core_separation: number | null;
  side_core_boostback: number | null;
  meco: number | null;
  stage_separation: number | null;
  center_stage_sep: number | null;
  second_stage_ignition: number | null;
  fairing_deploy: number | null;
  first_stage_boostback_burn: number | null;
  first_stage_entry_burn: number | null;
  first_stage_landing: number | null;
  'seco-1': number | null;
  second_stage_restart: number | null;
  'seco-2': number | null;
  payload_deploy: number | null;
  payload_deploy_1: number | null;
  payload_deploy_2: number | null;
  first_stage_landing_burn: number | null;
  'seco-3': number | null;
  'seco-4': number | null;
  side_core_entry_burn: number | null;
  center_core_entry_burn: number | null;
  side_core_landing: number | null;
  center_core_landing: number | null;
}

// Tipos auxiliares
export interface Dimension {
  meters: number | null;
  feet: number | null;
}

export interface Mass {
  kg: number | null;
  lb: number | null;
}

export interface PayloadWeight {
  id: string;
  name: string;
  kg: number;
  lb: number;
}

export interface Stage {
  thrust_sea_level: Thrust;
  thrust_vacuum: Thrust;
  reusable: boolean;
  engines: number;
  fuel_amount_tons: number;
  burn_time_sec: number | null;
}

export interface Thrust {
  kN: number;
  lbf: number;
}

export interface Engine {
  isp: ISP;
  thrust_sea_level: Thrust;
  thrust_vacuum: Thrust;
  number: number;
  type: string;
  version: string;
  layout: string;
  engine_loss_max: number | null;
  propellant_1: string;
  propellant_2: string;
  thrust_to_weight: number;
}

export interface ISP {
  sea_level: number;
  vacuum: number;
}

export interface LandingLegs {
  number: number;
  material: string | null;
}

export interface LaunchpadImages {
  large: string[];
}

export interface Patch {
  small: string | null;
  large: string | null;
}

export interface Reddit {
  campaign: string | null;
  launch: string | null;
  media: string | null;
  recovery: string | null;
}

export interface Flickr {
  small: string[];
  original: string[];
}

export interface Dragon {
  capsule: string | null;
  mass_returned_kg: number | null;
  mass_returned_lbs: number | null;
  flight_time_sec: number | null;
  manifest: string | null;
  water_landing: boolean | null;
  land_landing: boolean | null;
}

// Tipos para filtros y búsqueda
export interface LaunchFilters {
  search?: string;
  success?: boolean | null;
  upcoming?: boolean;
  dateFrom?: string;
  dateTo?: string;
  rocket?: string;
  launchpad?: string;
  sortBy?: 'date' | 'name' | 'flight_number';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface LaunchStats {
  total: number;
  success: number;
  failed: number;
  upcoming: number;
  success_rate: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

// Tipos específicos para datos de gráficas
export interface MockChartData {
  launchStats: {
    monthlyLaunches: ChartData;
    successRate: ChartData;
    rocketUsage: ChartData;
  };
  performanceMetrics: {
    launchFrequency: ChartData;
    reusability: ChartData;
    payloadCapacity: ChartData;
  };
  launchpadData: {
    launchpadUsage: ChartData;
    launchpadSuccess: ChartData;
  };
  missionTypes: {
    payloadTypes: ChartData;
    orbitTypes: ChartData;
  };
  technicalMetrics: {
    coreReuse: ChartData;
    landingSuccess: ChartData;
  };
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'radar';
  title: string;
  subtitle?: string;
  height?: number;
  data: ChartData;
  options?: any;
}

// Tipos para el estado global
export interface AppState {
  launches: Launch[];
  loading: boolean;
  error: string | null;
  filters: LaunchFilters;
  stats: LaunchStats | null;
  selectedLaunch: Launch | null;
}

// Tipos para componentes
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  className?: string;
}

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}
