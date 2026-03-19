/**
 * Example file with various code issues for demonstration
 * This file contains several issues that the code review agent will catch
 */

// Issue: Unused variable
const unused_variable = "this is not used";

// Issue: Missing error handling
export async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return data;
}

// Issue: High complexity function
function processUserData(user) {
  if (user.age > 18) {
    if (user.premium) {
      if (user.verified) {
        if (user.active) {
          if (user.subscribed) {
            return "premium_verified_active";
          }
        }
      }
    }
  }
  return "standard";
}

// Issue: Console statements
export function debugUserInfo(user) {
  console.log("User:", user);
  console.debug("Debug info", user.id);
  if (!user.email) {
    console.error("No email provided");
  }
  return user;
}

// Issue: Missing documentation
function calculateDiscount(original, percentage) {
  return original * (1 - percentage / 100);
}

// Issue: Snake case variable name
const user_email = "user@example.com";
const user_name = "John Doe";

// Good example: Properly documented function with error handling
/**
 * Validates user input
 * @param {Object} userData - The user data to validate
 * @param {string} userData.email - User email
 * @param {string} userData.name - User name
 * @returns {boolean} True if valid
 */
export function validateUserData(userData) {
  try {
    if (!userData.email || !userData.name) {
      throw new Error("Missing required fields");
    }
    return true;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}

// Another complex function
function generateReport(data) {
  let output = "";
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "A") {
      if (data[i].value > 100) {
        if (data[i].status === "active") {
          output += `[A] ${data[i].name}: ${data[i].value}\n`;
        }
      }
    } else if (data[i].type === "B") {
      if (data[i].value < 50) {
        if (data[i].status === "inactive") {
          output += `[B] ${data[i].name}: ${data[i].value}\n`;
        }
      }
    }
  }
  return output;
}
