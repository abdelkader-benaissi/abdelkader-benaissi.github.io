(function () {
  document.documentElement.classList.add('js');
  var button = document.querySelector('.menu-button');
  var nav = document.getElementById('navigation');
  if (button && nav) {
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { button.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); });
    });
  }
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.spotlight-card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--x', (event.clientX - rect.left) + 'px');
        card.style.setProperty('--y', (event.clientY - rect.top) + 'px');
      });
    });
  }
})();


/* Project pop-up modal */
(function () {
  var projects = {
    monitoring: {
      title: 'Production Monitoring Stack — Telegraf, InfluxDB & Grafana',
      tags: 'Telegraf / InfluxDB / Grafana / Docker',
      items: [
        ['Metric Collection', 'Deployed Telegraf agents across VPS and Docker nodes to aggregate real-time CPU, RAM, and disk I/O metrics'],
        ['Container Visibility', 'Configured specialized monitors to track container health, resource consumption, and application-level performance'],
        ['Data Visualization', 'Developed comprehensive Grafana dashboards to provide a centralized view of system health and infrastructure trends'],
        ['Storage Optimization', 'Utilized InfluxDB as a time-series database to efficiently store and query high-resolution monitoring data']
      ]
    },
    healthcheck: {
      title: 'Automated Systems Healthcheck & Reporting Suite',
      tags: 'PowerShell / EMC Networker / iDRAC / Active Directory',
      items: [
        ['Backup Monitoring', 'Integrated with EMC Networker REST API to automate backup job status and failure detection'],
        ['Hardware Health', 'Queried iDRAC REST API to monitor server hardware health and component status across infrastructure'],
        ['AD & NTP Auditing', 'Automated Active Directory user account auditing and NTP synchronization checks for compliance reporting'],
        ['Unified Reporting', 'Consolidated healthcheck results into automated reports for proactive issue detection and operational visibility']
      ]
    },
    'backup-pipeline': {
      title: 'Automated Encrypted Backup Pipeline',
      tags: 'Bash / Rclone / SSH / Cron',
      items: [
        ['Architecture', 'Designed and implemented an automated backup system for critical company applications'],
        ['Reliability', 'Encrypted transfers to remote VPS storage with 100% reliability and zero data loss incidents'],
        ['Alerting', 'Automated email notifications for backup failures and transfer interruptions']
      ]
    },
    'vuln-toolkit': {
      title: 'Automated Vulnerability Assessment Toolkit',
      tags: 'Python / Nmap / Nikto / Gemini API',
      items: [
        ['Development', 'Built an integrated security toolkit combining Nikto and Nmap for vulnerability scanning'],
        ['AI Integration', 'Used Google Gemini API to analyze results and extract critical vulnerabilities'],
        ['Automation', 'Deployed scheduled scans on VPS that generate weekly email reports with prioritized security findings and remediation steps']
      ]
    },
    'compliance-auditing': {
      title: 'Automated Compliance & Infrastructure Auditing Suite',
      tags: 'PowerShell / EMC Networker / iDRAC / Active Directory',
      items: [
        ['AD Auditing', 'Automated Active Directory user account auditing and NTP synchronization checks for compliance reporting'],
        ['Backup Assurance', 'Integrated with EMC Networker REST API to automate backup job status and failure detection'],
        ['Hardware Health', 'Queried iDRAC REST API to monitor server hardware health and component status across infrastructure'],
        ['Unified Reporting', 'Consolidated audit results into automated reports supporting government security-compliance requirements']
      ]
    },
    'encrypted-backup': {
      title: 'Encrypted Enterprise Backup System',
      tags: 'Bash / Rclone / SSH / Cron',
      items: [
        ['Architecture', 'Designed and implemented an automated backup system for critical company applications'],
        ['Security', 'Implemented encrypted backup transfers to remote VPS storage with 100% reliability and zero data loss incidents'],
        ['Monitoring', 'Integrated automated email alert system for backup failures and transfer interruptions']
      ]
    }
  };
  var modal = document.getElementById('project-modal');
  if (!modal) return;
  var titleEl = document.getElementById('project-modal-title');
  var tagsEl = modal.querySelector('.project-modal-tags');
  var listEl = modal.querySelector('.project-modal-list');
  var closeButton = modal.querySelector('.project-modal-close');
  var lastFocused = null;
  function openProject(key, card) {
    var data = projects[key];
    if (!data) return;
    lastFocused = card || document.activeElement;
    titleEl.textContent = data.title;
    tagsEl.textContent = data.tags;
    listEl.textContent = '';
    data.items.forEach(function (item) {
      var li = document.createElement('li');
      var strong = document.createElement('strong');
      strong.textContent = item[0] + ': ';
      li.appendChild(strong);
      li.appendChild(document.createTextNode(item[1]));
      listEl.appendChild(li);
    });
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeButton) closeButton.focus();
  }
  function closeProject() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  document.querySelectorAll('.project-card[data-project]').forEach(function (card) {
    card.addEventListener('click', function () { openProject(card.getAttribute('data-project'), card); });
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(card.getAttribute('data-project'), card); }
    });
  });
  if (closeButton) closeButton.addEventListener('click', closeProject);
  modal.addEventListener('click', function (event) { if (event.target === modal) closeProject(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && modal.classList.contains('open')) closeProject(); });
})();
