import * as React from "react";

interface EmailTemplateProps {
  email: string;
  name: string;
  code: string;
}

export function EmailTemplate({ email, name, code }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <h3>Code: ${code}</h3>
      <p>Expires in 15 minutes</p>
    </div>
  );
}
