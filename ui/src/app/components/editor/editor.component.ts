import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditorComponent {
  @Input() code = '';
  @Input() isLoading = false;
  @Output() codeChanged = new EventEmitter<string>();
  @Output() review = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  onCodeChange(event: any): void {
    this.code = event.target.value;
    this.codeChanged.emit(this.code);
  }

  onReview(): void {
    if (this.code.trim()) {
      this.review.emit(this.code);
    }
  }

  onClear(): void {
    this.code = '';
    this.clear.emit();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.code = e.target?.result as string;
        this.codeChanged.emit(this.code);
      };
      reader.readAsText(file);
    }
  }

  loadExample(): void {
    this.code = `// Example: User Authentication
async function authenticateUser(email, password) {
  console.log('Authenticating user:', email);
  
  const user_data = await fetchUser(email);
  
  if (user_data) {
    if (user_data.verified) {
      if (password === user_data.password) {
        console.warn('Password matches');
        return { success: true, user: user_data };
      }
    }
  }
  
  return { success: false };
}

function calculateScore(answers) {
  let total_score = 0;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].correct === true) {
      if (answers[i].difficulty === 'hard') {
        total_score += 10;
      } else {
        total_score += 5;
      }
    }
  }
  return total_score;
}`;
    this.codeChanged.emit(this.code);
  }
}
