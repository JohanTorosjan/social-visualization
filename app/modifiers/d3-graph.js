import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import * as d3 from 'd3';
import constants from 'social-visualization/utils/constants';

const formatedHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formatted = hour % 12 || 12;
    return `${formatted} ${period}`;
};

const margin = { top: 20, right: 20, bottom: 40, left: 40 };

export default class D3GraphModifier extends Modifier {
    constructor(owner, args) {
        super(owner, args);
        registerDestructor(this, this.cleanup);
    }

    modify(element, [data, width, height]) {
        this.drawGraph(element, [data, width, height])
    }

    cleanup() {
        const element = this.element;
        d3.select(element).select('svg').remove();
        d3.select(element).select('.tooltip').remove();
    }

    drawGraph(element, [data, width, height]) {
        let xScale = d3
            .scaleBand()
            .domain(d3.range(24))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        let yScale = d3
            .scaleBand()
            .domain([0, 1, 2, 3, 4, 5, 6])
            .range([margin.top, height - margin.bottom])
            .padding(0.1);

        const counts = {};
        data.forEach(({ day, hour }) => {
            const key = `${hour}-${day}`;
            counts[key] = (counts[key] || 0) + 1;
        });

        const maxPosts = d3.max(Object.values(counts));
        const radiusScale = d3.scaleSqrt().domain([0, maxPosts]).range([0.1, 12]);

        d3.select(element).select('svg').remove();
        d3.select(element).select('.tooltip').remove();

        const svg = d3
            .select(element)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#000')
            .style('color', '#0f0');

        const tooltip = d3
            .select(element)
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', '#000')
            .style('border', '1px solid #ccc')
            .style('padding', '5px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('color', '#0f0');

        svg
            .selectAll('circle')
            .data(Object.keys(counts))
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(+d.split('-')[0]) + xScale.bandwidth() / 2)
            .attr('cy', (d) => yScale(+d.split('-')[1]) + yScale.bandwidth() / 2)
            .attr('r', (d) => radiusScale(counts[d]))
            .style('fill', (d) =>
                counts[d] === maxPosts && maxPosts !== 1 ? '#0f0' : '#8a2be2',
            )
            .style('opacity', (d) => radiusScale(counts[d]) / 12)
            .on('mouseover', (event, d) => {
                const [hour, day] = d.split('-').map(Number);
                tooltip.style('opacity', 1);
                tooltip
                    .html(
                        `
      <strong>${constants.weekDays[day]} ${formatedHour(hour)}<br></strong>
      <strong>${counts[d]} ${counts[d] === 1 ? 'post' : 'posts'}</strong>
    `,
                    )
                    .style('left', event.pageX + 10 + 'px')
                    .style('top', event.pageY - 20 + 'px');
            })
            .on('mouseleave', () => {
                tooltip.style('opacity', 0);
            });

        let xAxis = d3.axisBottom(xScale).tickFormat((d) => formatedHour(d));
        let yAxis = d3.axisLeft(yScale).tickFormat((d) => constants.weekDays[d]);

        svg
            .append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(xAxis);
        svg
            .append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis);
    }
}
