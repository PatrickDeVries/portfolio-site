import { RepellentShape } from '@/common/components/Layout/BackgroundParticles/types'
import React from 'react'
import { Link } from 'react-router-dom'
import { WorkItem } from '../types'
import { BodySection, BodyText, HeaderText, ScalingImg, StyledCard, Tag, TagSection } from './style'

interface Props {
  item: WorkItem
}

const WorkCard: React.FC<Props> = ({ item }) => (
  <StyledCard
    as={item.to ? Link : item.href ? 'a' : undefined}
    href={item.href}
    to={item.to}
    $isLink={!!item.href || !!item.to}
    data-repel-particles={true}
    data-repel-shape={RepellentShape.Rectangle}
  >
    <HeaderText>{item.header}</HeaderText>
    <BodySection>
      <ScalingImg src={item.image} />
      <BodyText>{item.description}</BodyText>
    </BodySection>
    <TagSection>{item.tags?.map(tagText => <Tag key={tagText}>{tagText}</Tag>)}</TagSection>
  </StyledCard>
)

export default WorkCard
