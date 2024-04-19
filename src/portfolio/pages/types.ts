import { To } from 'react-router-dom'

export type WorkItem = {
  header: string
  image: string
  description: string
  tags?: string[]
  href?: string
  to?: To
}

export enum WorkCategory {
  WorkExperience = 'WORK_EXPERIENCE',
  GithubContributions = 'GITHUB_CONTRIBUTIONS',
  Certifications = 'CERTIFICATIONS',
  LiveSites = 'LIVE_SITES_I_HELPED_BUILD',
  ArtProjects = 'ART_PROJECTS',
  Random = 'RANDOM',
}
