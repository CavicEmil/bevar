export function unwrap({ data, error }) {
    if(error) throw error;
    return data;
}

export function unwrapMe(result) {
    return unwrap(result);
}

/* this makes it easy for us to handle supabase returning {data, error} 
    across components */