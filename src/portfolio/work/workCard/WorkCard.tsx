import React from 'react'
import { Link } from 'react-router-dom'
import { WorkItem } from '../types'
import { BodySection, BodyText, HeaderText, ScalingImg, StyledCard, Tag, TagSection } from './style'
interface WorkCardProps {
  item: WorkItem
}

const WorkCard = ({ item }: WorkCardProps) => {
  const route = item?.page ?? item?.href ?? ''
  return (
    <StyledCard>
      <div>
        {route ? (
          item?.href ? (
            <>
              <a href={item.href}>
                <HeaderText>{item.header}</HeaderText>
              </a>
              <a href={item.href}>
                <BodySection>
                  <ScalingImg src={process.env.PUBLIC_URL + item.image} />
                  <BodyText>{item.description}</BodyText>
                </BodySection>
              </a>
            </>
          ) : (
            <>
              <Link to={route}>
                <HeaderText>{item.header}</HeaderText>
              </Link>
              <Link to={route}>
                <BodySection>
                  <ScalingImg src={process.env.PUBLIC_URL + item.image} />
                  <BodyText>{item.description}</BodyText>
                </BodySection>
              </Link>
            </>
          )
        ) : (
          <>
            <HeaderText>{item.header}</HeaderText>
            <BodySection>
              <ScalingImg src={process.env.PUBLIC_URL + item.image} />
              <BodyText>{item.description}</BodyText>
            </BodySection>
          </>
        )}
      </div>
      <TagSection>
        {item.tags?.map(tagText => (
          <Tag key={tagText}>{tagText}</Tag>
        ))}
      </TagSection>
    </StyledCard>
  )
}

export default WorkCard
