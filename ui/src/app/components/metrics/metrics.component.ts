import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeMetrics } from '../../models';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MetricsComponent {
  @Input() metrics: CodeMetrics | null = null;

  getQualityLevel(): string {
    if (!this.metrics) return 'Unknown';
    if (this.metrics.qualityScore >= 90) return 'Excellent';
    if (this.metrics.qualityScore >= 80) return 'Good';
    if (this.metrics.qualityScore >= 70) return 'Average';
    if (this.metrics.qualityScore >= 60) return 'Fair';
    return 'Needs Work';
  }

  getQualityColor(): string {
    if (!this.metrics) return 'neutral';
    if (this.metrics.qualityScore >= 90) return 'excellent';
    if (this.metrics.qualityScore >= 80) return 'good';
    if (this.metrics.qualityScore >= 70) return 'average';
    if (this.metrics.qualityScore >= 60) return 'fair';
    return 'critical';
  }

  getQualityIcon(): string {
    if (!this.metrics) return '❓';
    if (this.metrics.qualityScore >= 90) return '⭐';
    if (this.metrics.qualityScore >= 80) return '✅';
    if (this.metrics.qualityScore >= 70) return '⚠️';
    if (this.metrics.qualityScore >= 60) return '⚠️';
    return '❌';
  }
}
