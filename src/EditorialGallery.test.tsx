import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EditorialGallery from './EditorialGallery';

describe('Les compositions des projets', () => {
  it.each([['unik', 5, 2], ['bertine', 7, 3]] as const)('présente toutes les créations de %s en duos puis un focus', (project, count, pairs) => {
    render(<EditorialGallery project={project} />);
    const sections = screen.getAllByRole('region');
    expect(sections).toHaveLength(pairs + 1);
    sections.slice(0, pairs).forEach(section => expect(within(section).getAllByRole('img')).toHaveLength(2));
    expect(within(sections[pairs]).getAllByRole('img')).toHaveLength(1);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(count);
    expect(new Set(images.map(image => image.getAttribute('src'))).size).toBe(count);
  });
  it('attribue correctement le logo préexistant de Bertine', () => {
    render(<EditorialGallery project="bertine" />);
    expect(screen.getByRole('img', { name: /logo existant/i })).toBeInTheDocument();
  });
});
