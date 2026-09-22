-- create todos

CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    CONSTRAINT fk_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);