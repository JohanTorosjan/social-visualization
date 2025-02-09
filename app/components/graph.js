import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import * as d3 from 'd3';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
export default class GraphComponent extends Component {
  @service postStream; // Injection du service

  @tracked maxPosts;

  get timestamps() {
    return this.postStream
      .getPostsByType(this.args.type)
      .map((post) => post.timestamp)
      .filter((timestamp) => timestamp);
  }
  get processedData() {
    return this.postStream
      .getPostsByType(this.args.type) // Récupère les posts du type donné
      .map((post) => {
        const date = new Date(post.timestamp * 1000); // Convertir le timestamp en date
        console.log(date.toISOString());

        return {
          day: date.getUTCDay(), // 0 = Dimanche, 6 = Samedi
          hour: date.getUTCHours(), // 0 - 23 (heure UTC)
        };
      });
  }

  drawGraph = modifier((element) => {
    const data = this.processedData;
    const width = 900,
      height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const xScale = d3
      .scaleBand()
      .domain(d3.range(24))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    // Y = Jour (Dimanche → Samedi)
    const yScale = d3
      .scaleBand()
      .domain([0, 1, 2, 3, 4, 5, 6])
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Comptage des posts par créneau jour/heure
    const counts = {};
    data.forEach(({ day, hour }) => {
      const key = `${hour}-${day}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    // 📌 Trouver le nombre maximum de posts
    const maxPosts = d3.max(Object.values(counts));
    this.maxPosts = maxPosts;
    // Échelle pour la taille des cercles
    const radiusScale = d3.scaleSqrt().domain([0, maxPosts]).range([0.1, 12]);

    // Supprimer l'ancien graphe avant de redessiner
    d3.select(element).select('svg').remove();
    d3.select(element).select('.tooltip').remove(); // Supprime tout tooltip existant

    // Ajouter un titre centré au-dessus du graphe

    // Créer le SVG
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f5f5f5'); // 📌 Ajout d'un fond gris clair
    const tooltip = d3
      .select(element)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Ajouter les cercles représentant les posts
    svg
      .selectAll('circle')
      .data(Object.keys(counts))
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(+d.split('-')[0]) + xScale.bandwidth() / 2)
      .attr('cy', (d) => yScale(+d.split('-')[1]) + yScale.bandwidth() / 2)
      .attr('r', (d) => radiusScale(counts[d]))
      .style('fill', (d) =>
        counts[d] === maxPosts && maxPosts !== 1 ? 'red' : 'black',
      ) // 📌 Le plus grand en rouge
      .style('opacity', 0.7)
      .on('mouseover', (event, d) => {
        const [hour, day] = d.split('-').map(Number);
        tooltip.style('opacity', 1);
        tooltip
          .html(
            `
          <strong>${['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][day]}
        ${hour}h<br></strong>
          <strong>Posts :</strong> ${counts[d]}
        `,
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 20 + 'px');
      })
      .on('mouseleave', () => {
        tooltip.style('opacity', 0);
      });

    // 📌 NOUVELLES ÉTIQUETTES D'AXES
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
      if (d === 0) return '12 am'; // Minuit
      if (d === 12) return '12 '; // Midi
      return d % 12;
    });

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]); // 📌 Afficher les jours en anglais

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);
  });

  // drawHeatMap = modifier((element) => {
  //   const data = this.processedData;

  //   // 📌 Dimensions et marges
  //   const width = 900, height = 350;
  //   const margin = { top: 40, right: 20, bottom: 70, left: 50 }; // 📌 Ajustement pour la légende

  //   // 📌 Définition des jours et heures
  //   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //   const hours = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
  //                  "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

  //   // 📌 Création des échelles pour X et Y
  //   const xScale = d3.scaleBand()
  //     .domain(hours)
  //     .range([margin.left, width - margin.right])
  //     .padding(0.05);

  //   const yScale = d3.scaleBand()
  //     .domain(days)
  //     .range([margin.top, height - margin.bottom])
  //     .padding(0.05);

  //   // 📌 Comptage des posts par créneau
  //   const counts = {};
  //   data.forEach(({ day, hour }) => {
  //     const hour12 = hour % 12 || 12;
  //     const period = hour < 12 ? " AM" : " PM";
  //     const key = `${hour12}${period}-${days[day]}`;
  //     counts[key] = (counts[key] || 0) + 1;
  //   });

  //   // 📌 Définition d'une échelle de couleurs
  //   const maxPosts = d3.max(Object.values(counts)) || 1;
  //   const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, maxPosts]);

  //   // 📌 Supprimer tout graphe existant
  //   d3.select(element).select("svg").remove();

  //   // 📌 Création du SVG
  //   const svg = d3.select(element)
  //     .append("svg")
  //     .attr("width", width)
  //     .attr("height", height + 60) // 📌 Espace supplémentaire pour la légende
  //     .style("background", "#f5f5f5");

  //   // 📌 Ajout du titre
  //   svg.append("text")
  //     .attr("x", width / 2)
  //     .attr("y", margin.top - 20)
  //     .attr("text-anchor", "middle")
  //     .style("font-size", "18px")
  //     .style("font-weight", "bold")
  //     .text("Commit Activity Heatmap by Day and Hour");

  //   // 📌 Ajout des rectangles pour la heatmap
  //   svg.selectAll("rect")
  //     .data(Object.keys(counts))
  //     .enter()
  //     .append("rect")
  //     .attr("x", d => xScale(d.split("-")[0]))
  //     .attr("y", d => yScale(d.split("-")[1]))
  //     .attr("width", xScale.bandwidth())
  //     .attr("height", yScale.bandwidth())
  //     .style("fill", d => colorScale(counts[d]))
  //     .style("stroke", "#ffffff")
  //     .style("stroke-width", 1);

  //   // 📌 Ajout des axes
  //   const xAxis = d3.axisBottom(xScale);
  //   const yAxis = d3.axisLeft(yScale);

  //   svg.append("g")
  //     .attr("transform", `translate(0,${height - margin.bottom})`)
  //     .call(xAxis);

  //   svg.append("g")
  //     .attr("transform", `translate(${margin.left},0)`)
  //     .call(yAxis);

  //   // 📌 AJOUT DE LA LÉGENDE
  //   const legendWidth = 250, legendHeight = 10;
  //   const legendX = width / 2 - legendWidth / 2;
  //   const legendY = height + 35; // 📌 Ajustement pour ne pas dépasser

  //   // Échelle de couleur pour la légende
  //   const legendScale = d3.scaleLinear()
  //     .domain([0, maxPosts])
  //     .range([0, legendWidth]);

  //   // Groupe pour la légende
  //   const legend = svg.append("g")
  //     .attr("transform", `translate(${legendX},${legendY})`);

  //   // Dégradé de couleur pour la légende
  //   const defs = svg.append("defs");
  //   const linearGradient = defs.append("linearGradient")
  //     .attr("id", "legend-gradient")
  //     .attr("x1", "0%")
  //     .attr("y1", "0%")
  //     .attr("x2", "100%")
  //     .attr("y2", "0%");

  //   linearGradient.append("stop")
  //     .attr("offset", "0%")
  //     .attr("stop-color", colorScale(0));

  //   linearGradient.append("stop")
  //     .attr("offset", "100%")
  //     .attr("stop-color", colorScale(maxPosts));

  //   // Dessiner la barre de la légende
  //   legend.append("rect")
  //     .attr("width", legendWidth)
  //     .attr("height", legendHeight)
  //     .style("fill", "url(#legend-gradient)")
  //     .style("stroke", "black") // 📌 Ajout d'une bordure pour une meilleure visibilité
  //     .style("stroke-width", 1);

  //   // Ajouter l’axe de la légende
  //   const legendAxis = d3.axisBottom(legendScale)
  //     .ticks(5)
  //     .tickFormat(d3.format("d"));
  //   legend.append("g")
  //     .attr("transform", `translate(0, ${legendHeight})`)
  //     .call(legendAxis);
  // });
}
